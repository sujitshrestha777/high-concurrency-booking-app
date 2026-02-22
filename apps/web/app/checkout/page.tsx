import BookingForm from "components/booking";

export default function Home() {
  return (
    <main className="relative min-h-screen p-8  bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />

      <BookingForm />
    </main>
  );
}
