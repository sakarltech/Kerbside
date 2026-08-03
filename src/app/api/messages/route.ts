import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { messageSchema } from "@/lib/validators";
import { notificationService } from "@/lib/services/notification-service";

/**
 * GET /api/messages
 * Get conversations for the authenticated user. Groups messages by the other party.
 * Returns latest message, unread count, other user's name. Sorted by most recent.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = session.user as { id: string; role: string };

    // Get all messages involving this user
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: user.id }, { receiverId: user.id }],
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group by conversation partner
    const conversationMap = new Map<
      string,
      {
        partnerId: string;
        partnerName: string;
        latestMessage: string;
        latestMessageAt: Date;
        unreadCount: number;
      }
    >();

    for (const msg of messages) {
      const partnerId =
        msg.senderId === user.id ? msg.receiverId : msg.senderId;
      const partnerName =
        msg.senderId === user.id ? msg.receiver.name : msg.sender.name;

      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          partnerId,
          partnerName,
          latestMessage: msg.content,
          latestMessageAt: msg.createdAt,
          unreadCount: 0,
        });
      }

      // Count unread messages from this partner
      if (msg.receiverId === user.id && !msg.read) {
        const conv = conversationMap.get(partnerId)!;
        conv.unreadCount += 1;
      }
    }

    const conversations = Array.from(conversationMap.values()).sort(
      (a, b) =>
        b.latestMessageAt.getTime() - a.latestMessageAt.getTime()
    );

    return NextResponse.json({ success: true, data: conversations });
  } catch (error) {
    console.error("[API] GET /api/messages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages
 * Send a message. Auth check. Validates receiver and content.
 * Privacy rule: can only message if have/had a booking together.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = session.user as { id: string; role: string };

    const body = await request.json();
    const result = messageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues },
        { status: 400 }
      );
    }

    // Privacy check: verify users have/had a booking together
    const senderProfiles = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        instructorProfile: { select: { id: true } },
        studentProfile: { select: { id: true } },
      },
    });

    const receiverProfiles = await prisma.user.findUnique({
      where: { id: result.data.receiverId },
      include: {
        instructorProfile: { select: { id: true } },
        studentProfile: { select: { id: true } },
      },
    });

    if (!receiverProfiles) {
      return NextResponse.json(
        { success: false, error: "Receiver not found" },
        { status: 404 }
      );
    }

    // Check for shared bookings (either direction)
    const profileIds = {
      senderStudentId: senderProfiles?.studentProfile?.id,
      senderInstructorId: senderProfiles?.instructorProfile?.id,
      receiverStudentId: receiverProfiles.studentProfile?.id,
      receiverInstructorId: receiverProfiles.instructorProfile?.id,
    };

    const hasBookingTogether = await prisma.booking.findFirst({
      where: {
        OR: [
          {
            studentId: profileIds.senderStudentId || "",
            instructorId: profileIds.receiverInstructorId || "",
          },
          {
            studentId: profileIds.receiverStudentId || "",
            instructorId: profileIds.senderInstructorId || "",
          },
        ],
      },
    });

    if (!hasBookingTogether && user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "You can only message users you have a booking with",
        },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId: result.data.receiverId,
        content: result.data.content,
        bookingId: result.data.bookingId,
      },
    });

    // Send notification
    await notificationService.notifyNewMessage(message);

    return NextResponse.json(
      { success: true, data: message },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /api/messages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}
