export default function LoadingOverlay() {
  return (
    <div className="h-screen w-screen fixed top-0 left-0 bg-black bg-opacity-20 z-[10000] flex justify-center items-center">
      <l-newtons-cradle
        size="100"
        stroke-length="0.35"
        speed=" 1.2"
        // stroke='6.0'
        color="#1f69f3"
      ></l-newtons-cradle>
    </div>
  );
}
