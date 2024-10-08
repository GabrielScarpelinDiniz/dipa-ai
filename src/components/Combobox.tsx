"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
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

export function Combobox({ predefinedList, emptyMessage }: Readonly<{ predefinedList: { label: string; value: string }[], emptyMessage: string }>) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? predefinedList.find((predefinedItem) => predefinedItem.value === value)?.label
            : "Selecione..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-4 max-h-[300px]">
        <Command>
          <CommandInput placeholder="Procurar..." />
          <CommandList >
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className="max-h-[220px] overflow-y-scroll">
              {predefinedList.map((predefinedItem) => (
                <CommandItem
                  key={predefinedItem.value}
                  value={predefinedItem.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === predefinedItem.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {predefinedItem.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
