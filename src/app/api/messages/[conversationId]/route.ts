import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/messages/[conversationId]
 * Get all messages between the authenticated user and conversationId user.
 * Sorted by date. Marks unread messages as read.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = session.user as { id: string; role: string };
    const partnerId = params.conversationId;

    // Get all messages between these two users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.id, receiverId: partnerId },
          { senderId: partnerId, receiverId: user.id },
        ],
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    // Mark unread messages from the partner as read
    await prisma.message.updateMany({
      where: {
        senderId: partnerId,
        receiverId: user.id,
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("[API] GET /api/messages/[conversationId] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/messages/[conversationId]
 * Mark all messages in conversation as read.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = session.user as { id: string; role: string };
    const partnerId = params.conversationId;

    const result = await prisma.message.updateMany({
      where: {
        senderId: partnerId,
        receiverId: user.id,
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json({
      success: true,
      data: { markedAsRead: result.count },
    });
  } catch (error) {
    console.error("[API] PUT /api/messages/[conversationId] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark messages as read" },
      { status: 500 }
    );
  }
}
