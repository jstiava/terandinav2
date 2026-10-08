"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/utilities/ui"

export function Combobox({
    disabled = false,
    className = "",
    options,
    placeholder = "Select framework...",
    onChange = () => { }
}: {
    disabled?: boolean,
    className?: string,
    options: {
        value: string,
        label: string
    }[],
    placeholder: string,
    onChange?: (value: string) => any
}) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={
                        cn(
                            "w-[200px] justify-between",
                            className
                        )
                    }
                >
                    {value
                        ? options.find((option) => option.value === value)?.label
                        : placeholder}
                    <ChevronsUpDown className="opacity-50" style={{
                        height: "1rem"
                    }} />
                </Button>
            </PopoverTrigger>
            <PopoverContent
            className={
                cn(
                    "w-[18rem] justify-between"
                )
            }>
                <Command>
                    <CommandInput placeholder={placeholder} className="h-9" />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue : any) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false);
                                        onChange(currentValue);
                                    }}
                                >
                                    {option.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
