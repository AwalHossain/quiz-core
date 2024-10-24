import { redirect } from "next/navigation";


// redirect to group page
export default function Home() {
  //  redirect group page component
  return redirect("/home");
}
