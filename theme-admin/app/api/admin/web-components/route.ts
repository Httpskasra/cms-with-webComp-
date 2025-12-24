import { NextResponse } from "next/server";
import { fetchRegistryComponents } from "../../../../src/lib/webComponentsRegistry";

const isDevAllowed =
  process.env.NODE_ENV === "development" ||
  process.env.ADMIN_DEV_MODE === "true";

export async function GET() {
  if (!isDevAllowed) {
    return NextResponse.json(
      { error: "This endpoint is only available in development mode." },
      { status: 403 }
    );
  }

  try {
    const components = await fetchRegistryComponents();
    return NextResponse.json({ components }, { status: 200 });
  } catch (error) {
    console.error("❌ [/api/admin/web-components] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to fetch web components",
        message,
        registryUrl: process.env.WEB_COMPONENT_REGISTRY_URL,
      },
      { status: 502 }
    );
  }
}
