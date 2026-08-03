"use client";

const categories = [

"All",

"Signature",

"Fresh",

"Luxury",

"Oud",

"Limited"

];

export default function CategoryFilter(){

return(

<div className="flex flex-wrap gap-4">

{categories.map((item)=>(

<button

key={item}

className="rounded-full border border-white/10 px-6 py-3 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"

>

{item}

</button>

))}

</div>

)

}