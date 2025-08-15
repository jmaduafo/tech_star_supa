import React from 'react'

function Banner({ text }: { readonly text: "pending" | "paid" | "ongoing" | "discontinued" | "unpaid" | "completed"}) {

    function colorPalette(text: string) {
        if (text.toLowerCase() === "Pending".toLowerCase()) {
            return "bg-pendingBg border-pendingBorder"
        } 
        else if (text.toLowerCase() === "Paid".toLowerCase()) {
             return "bg-paidBg border-paidBorder"
        }
        else if (text.toLowerCase() === "Ongoing".toLowerCase()) {
             return "bg-ongoingBg border-ongoingBorder"
        }
        else if (text.toLowerCase() === "Discontinued".toLowerCase()) {
             return "bg-ongoingBg border-ongoingBorder"
        }
        else if (text.toLowerCase() === "Unpaid".toLowerCase()) {
             return "bg-unpaidBg border-unpaidBorder"
        }
        else if (text.toLowerCase() === "Completed".toLowerCase()) {
             return "bg-completedBg border-completedBorder"
        }
    }
    
  return (
    <p className={`px-4 py-[2px] rounded-full w-fit text-[14.5px] capitalize border-[1px] ${colorPalette(text)}`}>{text}</p>
  )
}

export default Banner