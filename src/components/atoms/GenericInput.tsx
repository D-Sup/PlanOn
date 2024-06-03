import { useState, useRef } from "react"

import IconCalendar from "../../assets/images/icon-calendar.svg?react";
import IconCircleX from "../../assets/images/icon-circle-x.svg?react";

import formatDate from "@/utils/formatDate";
import { ko } from "date-fns/locale";
import { cn } from "@/utils/cn"
import { Button } from "@/components/shadcnUIKit/button"
import { Calendar } from "@/components/shadcnUIKit/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcnUIKit/popover"

import IconClock from "../../assets/images/icon-clock.svg?react";

export interface GenericInputProps {
  className: string,
  id: string,
  value?: string,
  type?: "text" | "date" | "time" | "textarea",
  placeholder?: string,
  readOnly?: boolean,
  handleInputClick?: () => void,
  handleInputChange?: (value: string) => void,
  resetInputValue?: () => void,
}

const GenericInput = ({ className, id, value, type, placeholder, readOnly = false, handleInputClick, handleInputChange, resetInputValue }: GenericInputProps) => {

  let initialValue;
  switch (type) {
    case "date":
      initialValue = undefined;
      break;
    case "time":
      initialValue = "00:00";
      break;
    case "text":
      initialValue = "";
      break;
    case "textarea":
      initialValue = "";
      break;
    default:
      initialValue = placeholder;
  }

  const [input, setInput] = useState<Date | string | undefined>(value || initialValue);

  const timeInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (timeInputRef.current) {
      timeInputRef.current.focus();
    }
    handleInputClick && handleInputClick()
  };


  return (
    <div className={`px-[15px] ${type === "textarea" && "py-[10px]"} flex items-center w-full bg-input transition duration-300 ${className} `}
      onClick={handleClick}>
      <label htmlFor={id} className="a11y-hidden">{id}</label>

      {type === "time" && <IconClock className="mr-[10px]" width={15} height={15} fill={"var(--gray-old)"} />}

      {(type === "text" || type === "time") &&
        <input
          ref={timeInputRef}
          className={"w-full bg-input text-md text-white hidden-clock text-left"}
          type={type}
          id={id}
          placeholder={placeholder}
          value={value || input as string} autoComplete="off"
          onChange={((e) => {
            const changeValue = e.target.value
            setInput(changeValue)
            handleInputChange && handleInputChange(changeValue);
          })}
          readOnly={readOnly}
        />
      }

      {type === "textarea" &&
        <textarea
          className="w-full h-full text-md text-base text-white resize-none text-md text-white overflow-y-scroll"
          id={id}
          placeholder={placeholder}
          value={input as string}
          onChange={((e) => {
            const changeValue = e.target.value
            setInput(changeValue)
            handleInputChange && handleInputChange(changeValue);
          })}
        />
      }

      {type === "date" &&
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              id={id}
              className={cn(
                "w-full px-[0] text-left font-normal",
                !input && "text-muted-foreground",
                className
              )}
            >
              <div className="mr-auto flex-center gap-[10px]">
                <IconCalendar width={15} height={15} fill={"var(--gray-old)"} />
                {input ? (
                  <span className="text-md text-white">{input as string}</span>
                ) : (
                  <span className="text-md text-gray-old">{"날짜 선택"}</span>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={new Date(value as string) || input as Date}
              onSelect={(e) => {
                const formattedInput = formatDate(e as Date, 4)
                handleInputChange && handleInputChange(formattedInput)
                setInput(formattedInput)
              }}
              className=""
              locale={ko}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      }

      {type !== "date" && type !== "time" &&
        <button className={`${type === "textarea" && "mb-auto mt-[6px]"} relative z-10 type="button`} >
          <IconCircleX
            className="transition duration-300"
            style={{
              opacity:
                `${typeof value === "string" && value.length > 0 ? 1 : 0}` ||
                `${typeof input === "string" && input.length > 0 ? 1 : 0}`
            }}
            width={15}
            height={15}
            fill={"var(--gray-old)"}
            onClick={(e) => {
              e.stopPropagation();
              setInput("")
              resetInputValue && resetInputValue()
            }}
          />
        </button>
      }
    </div>
  )
}

export default GenericInput