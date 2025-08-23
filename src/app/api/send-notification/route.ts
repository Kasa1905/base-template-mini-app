import { notificationDetailsSchema } from "@farcaster/frame-sdk";
import { NextRequest } from "next/server";
import { z } from "zod";
import { setUserNotificationDetails } from "~/lib/kv";
import { sendFrameNotification } from "~/lib/notifs";
import { sendNeynarFrameNotification } from "~/lib/neynar";

interface ProofVaultNotification {
  id: string;
  fid: string;
  title: string;
  message: string;
  type: 'credential_shared' | 'credential_verified' | 'credential_minted' | 'credential_revoked';
  data?: any;
  createdAt: string;
  read: boolean;
}

// Mock notifications storage for ProofVault
const proofVaultNotifications: ProofVaultNotification[] = [
  {
    id: "1",
    fid: "12345",
    title: "Credential Verified",
    message: "Your Bachelor of Computer Science credential has been verified",
    type: "credential_verified",
    data: { tokenId: "1", issuer: "MIT" },
    createdAt: new Date().toISOString(),
    read: false
  }
];

const requestSchema = z.object({
  fid: z.number(),
  notificationDetails: notificationDetailsSchema.optional(),
  title: z.string().optional(),
  message: z.string().optional(),
  type: z.enum(['credential_shared', 'credential_verified', 'credential_minted', 'credential_revoked']).optional(),
  customData: z.any().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const neynarEnabled = process.env.NEYNAR_API_KEY && process.env.NEYNAR_CLIENT_ID;
    const requestJson = await request.json();
    const requestBody = requestSchema.safeParse(requestJson);

    if (requestBody.success === false) {
      return Response.json(
        { success: false, errors: requestBody.error.errors },
        { status: 400 }
      );
    }

    const { fid, notificationDetails, title, message, type, customData } = requestBody.data;

    // Handle ProofVault custom notifications
    if (title && message && type) {
      const proofVaultNotification: ProofVaultNotification = {
        id: Date.now().toString(),
        fid: fid.toString(),
        title,
        message,
        type,
        data: customData || {},
        createdAt: new Date().toISOString(),
        read: false
      };

      proofVaultNotifications.unshift(proofVaultNotification);
      console.log('ProofVault notification created:', proofVaultNotification);

      // Send Farcaster notification if details provided
      if (notificationDetails) {
        if (neynarEnabled) {
          await sendNeynarFrameNotification({
            fid,
            title,
            body: message,
          });
        } else {
          await setUserNotificationDetails(fid, notificationDetails);
          await sendFrameNotification({ fid, title, body: message });
        }
      }

      return Response.json({
        success: true,
        data: proofVaultNotification,
        message: 'ProofVault notification sent successfully'
      });
    }

    // Handle standard Farcaster notifications
    if (notificationDetails) {
      if (!neynarEnabled) {
        await setUserNotificationDetails(fid, notificationDetails);
      }

      const notificationTitle = title || "ProofVault Update";
      const notificationBody = message || "You have a new update in ProofVault";

      if (neynarEnabled) {
        await sendNeynarFrameNotification({
          fid,
          title: notificationTitle,
          body: notificationBody,
        });
      } else {
        await sendFrameNotification({
          fid,
          title: notificationTitle,
          body: notificationBody,
        });
      }

      return Response.json({ success: true, message: 'Frame notification sent successfully' });
    }

    return Response.json(
      { success: false, error: 'Either notificationDetails or ProofVault notification fields (title, message, type) are required' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Send notification error:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to send notification' },
      { status: 500 }
    );
  }
}

// GET /api/send-notification?fid=12345 - Get ProofVault notifications for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!fid) {
      return Response.json(
        { success: false, error: 'FID is required' },
        { status: 400 }
      );
    }

    // Filter notifications for user
    let userNotifications = proofVaultNotifications.filter(
      notification => notification.fid === fid
    );

    // Filter unread only if requested
    if (unreadOnly) {
      userNotifications = userNotifications.filter(notification => !notification.read);
    }

    // Limit results
    userNotifications = userNotifications.slice(0, limit);

    return Response.json({
      success: true,
      data: userNotifications,
      count: userNotifications.length,
      unreadCount: proofVaultNotifications.filter(n => n.fid === fid && !n.read).length
    });

  } catch (error: any) {
    console.error('Get ProofVault notifications error:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to get notifications' },
      { status: 500 }
    );
  }
}
