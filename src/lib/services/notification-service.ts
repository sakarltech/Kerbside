import type { Booking, Message } from "@prisma/client";

/**
 * NotificationService handles sending notifications for various events.
 * Currently uses console logging as a placeholder - in production this would
 * integrate with email (e.g. SendGrid), push notifications, or SMS providers.
 */
export class NotificationService {
  /**
   * Notify student and instructor that a booking has been confirmed
   */
  async notifyBookingConfirmed(booking: Booking): Promise<void> {
    console.log(
      `[Notification] Booking ${booking.id} confirmed. ` +
        `Student: ${booking.studentId}, Instructor: ${booking.instructorId}`
    );
    // TODO: Send email/push notification to both parties
  }

  /**
   * Notify the affected party that a booking has been cancelled
   */
  async notifyBookingCancelled(
    booking: Booking,
    cancelledBy: string
  ): Promise<void> {
    console.log(
      `[Notification] Booking ${booking.id} cancelled by ${cancelledBy}. ` +
        `Student: ${booking.studentId}, Instructor: ${booking.instructorId}`
    );
    // TODO: Send email/push notification to the other party
  }

  /**
   * Notify the receiver of a new message
   */
  async notifyNewMessage(message: Message): Promise<void> {
    console.log(
      `[Notification] New message from ${message.senderId} to ${message.receiverId}`
    );
    // TODO: Send push notification or email digest
  }

  /**
   * Notify student of replacement instructor suggestions
   */
  async notifyReplacementSuggested(
    studentId: string,
    newInstructors: { id: string; name: string }[]
  ): Promise<void> {
    console.log(
      `[Notification] Replacement instructors suggested for student ${studentId}: ` +
        newInstructors.map((i) => i.name).join(", ")
    );
    // TODO: Send email with replacement options
  }
}

export const notificationService = new NotificationService();
