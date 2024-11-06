export default function Loading() {
  return (
    <div className="flex flex-1 justify-center items-center">
      <l-hourglass
        size="70"
        stroke-length="0.35"
        speed=" 1.0"
        // stroke='6.0'
        color="#1f69f3"
      ></l-hourglass>
    </div>
  );
}
