 import ActionDropdown from "@/components/admin/ActionDropdown";
import StatusBtn from "@/components/admin/StatusBtn";
import TableFilter from "@/components/admin/TableFilter";
import TableHeader from "@/components/admin/TableHeader";
import { fetchRooms } from "@/utils/api";

export default async function Page() {
  const { success, data: rooms, message } = await fetchRooms();
  console.log(success,"successdata");
  

  if (!success) {
    throw new Error(message);
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <TableHeader
        title="Room Type"
        path="/admin/room-type/add"
      />

      <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        <TableFilter />

        {/* Header */}
        <div className="hidden grid-cols-12 border-b border-gray-100 bg-gray-50 px-4 py-3 lg:grid">
          <div className="col-span-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            ID
          </div>

          <div className="col-span-5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Name
          </div>

          <div className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Slug
          </div>

          <div className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Status
          </div>

          <div className="col-span-2 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Action
          </div>
        </div>

        {/* Empty State */}
        {rooms.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold">
                No Rooms Found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                There are no room types available right now.
              </p>
            </div>
          </div>
        ) : (
          rooms.map((room, index) => (
            <div
              key={room._id}
              className="grid grid-cols-1 gap-3 border-b border-gray-100 px-4 py-4 transition hover:bg-gray-50 lg:grid-cols-12 lg:items-center"
            >
              {/* ID */}
              <div className="hidden lg:col-span-1 lg:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold">
                  {index + 1}
                </div>
              </div>

              {/* Name */}
              <div className="lg:col-span-5">
                <h2 className="truncate text-sm font-bold">
                  {room.name}
                </h2>

                <p className="mt-1 text-xs text-gray-500 lg:hidden">
                  {room.slug}
                </p>
              </div>

              {/* Slug */}
              <div className="hidden lg:col-span-2 lg:block">
                <span className="rounded-xl bg-gray-100 px-3 py-1 text-xs">
                  {room.slug}
                </span>
              </div>

              {/* Status */}
              <div className="lg:col-span-2">
                <StatusBtn
                  status={room.status}
                  path={`room-type/status-update/${room._id}`}
                />
              </div>

              {/* Action */}
              <div className="hidden justify-end lg:col-span-2 lg:flex">
                <ActionDropdown
                  module="room-type"
                  id={room._id}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}