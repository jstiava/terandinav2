
import { ReactNode, useContext, useEffect, useState } from "react"
import * as Drawer from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon, SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import { Category, Product, User } from "@/payload-types";
import Fuse from 'fuse.js';
import ProductCard from "@/app/(session)/(frontend)/products/ProductCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartProvider } from "@/components/Cart/CartProviderComponent";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useRouter } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import * as DropdownMenu from "@/components/ui/dropdown-menu";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import AdminDrawerClient from "@/components/AdminDrawer/Component.client";



const SORT_OPTIONS = [
    { label: "A-Z", value: "a-z" },
    { label: "Latest selection", value: "latest" }
]

export default async function AdminDrawer(props: {
    user: User,
    token: string
}) {


    return (
        <AdminDrawerClient {...{
            user: props.user,
            token: props.token
        }} />
    )

}