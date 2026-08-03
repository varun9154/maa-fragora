import ProductCard from "@/components/product/ProductCard";
import SectionTitle from "@/components/ui/SectionTitle";

const perfumes = [

{
name:"Royal Oud",
image:"https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800",
price:999,
oldPrice:1499
},

{
name:"Ocean Mist",
image:"https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
price:899,
oldPrice:1399
},

{
name:"Noir Gold",
image:"https://images.unsplash.com/photo-1615634262417-9f0c5d1eaf1f?w=800",
price:1199,
oldPrice:1699
}

];

export default function BestSellers(){

return(

<section className="mx-auto max-w-7xl px-6 py-28">

<SectionTitle

subtitle="BEST SELLERS"

title="Customer Favorites"

/>

<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

{perfumes.map((item)=>(

<ProductCard

key={item.name}

name={item.name}

image={item.image}

price={item.price}

oldPrice={item.oldPrice}

/>

))}

</div>

</section>

)

}