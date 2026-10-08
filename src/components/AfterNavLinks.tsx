import { Button } from "@payloadcms/ui";
import { EditIcon } from "lucide-react";

export default function AfterNavLinks() {

  return (
    <div style={{
      width: "100%"
    }}>
      <Button className="jjps-button">
        <EditIcon size={16} />
        Edit Home Page
      </Button>
    </div>
  )
}
