import {
  ParseWebhookEvent,
  parseWebhookEvent,
  verifyAppKeyWithNeynar,
} from "@farcaster/frame-node";
import { NextRequest } from "next/server";
import {
  deleteUserNotificationDetails,
  setUserNotificationDetails,
} from "~/lib/kv";
import { sendFrameNotification } from "~/lib/notifs";

export async function POST(request: NextRequest) {
  try {
    // If Neynar is enabled, handle Neynar webhooks
    const neynarEnabled = process.env.NEYNAR_API_KEY && process.env.NEYNAR_CLIENT_ID;
    
    if (neynarEnabled) {
      // Handle Neynar webhook for ProofVault
      const requestJson = await request.json();
      
      let data;
      try {
        data = await parseWebhookEvent(requestJson, verifyAppKeyWithNeynar);
      } catch (e: unknown) {
        const error = e as ParseWebhookEvent.ErrorType;

        switch (error.name) {
          case "VerifyJsonFarcasterSignature.InvalidDataError":
          case "VerifyJsonFarcasterSignature.InvalidEventDataError":
            return Response.json(
              { success: false, error: error.message },
              { status: 400 }
            );
          case "VerifyJsonFarcasterSignature.InvalidAppKeyError":
            return Response.json(
              { success: false, error: error.message },
              { status: 401 }
            );
          case "VerifyJsonFarcasterSignature.VerifyAppKeyError":
            return Response.json(
              { success: false, error: error.message },
              { status: 500 }
            );
        }
      }

      const fid = data.fid;
      const event = data.event;

      // Handle ProofVault-specific events
      switch (event.event) {
        case "frame_added":
          if (event.notificationDetails) {
            await setUserNotificationDetails(fid, event.notificationDetails);
            await sendFrameNotification({
              fid,
              title: "Welcome to ProofVault",
              body: "Your credential vault is now connected to Farcaster",
            });
          } else {
            await deleteUserNotificationDetails(fid);
          }
          break;

        case "frame_removed":
          await deleteUserNotificationDetails(fid);
          break;

        case "notifications_enabled":
          await setUserNotificationDetails(fid, event.notificationDetails);
          await sendFrameNotification({
            fid,
            title: "ProofVault Notifications",
            body: "You'll now get notified about credential updates",
          });
          break;

        case "notifications_disabled":
          await deleteUserNotificationDetails(fid);
          break;
      }

      return Response.json({ success: true });
    }

    // Handle custom ProofVault webhooks
    const body = await request.json();
    const { event, data } = body;

    console.log('Received ProofVault webhook event:', event, data);

    // Handle different webhook events
    switch (event) {
      case 'credential_shared':
        // Handle when someone shares a credential
        console.log('Credential shared:', data.tokenId);
        break;
      
      case 'credential_verified':
        // Handle when someone verifies a credential
        console.log('Credential verified:', data.tokenId);
        break;
      
      case 'cast_created':
        // Handle when someone creates a cast with ProofVault share
        if (data?.text?.includes('ProofVault')) {
          console.log('ProofVault share detected in cast:', data.hash);
        }
        break;
      
      default:
        console.log('Unhandled webhook event:', event);
    }

    return Response.json({
      success: true,
      message: 'ProofVault webhook processed successfully',
      event,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// GET /api/webhook - Webhook verification
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const challenge = searchParams.get('hub.challenge');
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');

    // Verify webhook setup
    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      return new Response(challenge, { status: 200 });
    }

    return Response.json({
      success: true,
      message: 'ProofVault webhook endpoint is active',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Webhook verification error:', error);
    return Response.json(
      { success: false, error: error.message || 'Webhook verification failed' },
      { status: 500 }
    );
  }
}
