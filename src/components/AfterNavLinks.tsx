import { Button } from "@payloadcms/ui";
import { EditIcon } from "lucide-react";
import { getPayload } from "payload";
import configPromise from '@payload-config'
import { Page } from "@/payload-types";

export default async function AfterNavLinks() {

  const payload = await getPayload({
    config: configPromise,
  });

  const settings = await payload.findGlobal({
    slug: 'settings',
    depth: 1,
    draft: false
  });

  if (!settings.frontPage) {
    return null;
  }

  return (
    <div style={{
      width: "100%"
    }}>
      <a href={`/admin/collections/pages/${(settings.frontPage as Page).id}`}>Edit Home Page</a>
    </div>
  )
}
