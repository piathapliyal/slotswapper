import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export default function Marketplace(){
  const qc = useQueryClient();


  const { data: market = [], isLoading } = useQuery({
    queryKey: ["market"],
    queryFn: async () => (await api.get("/swappable-slots")).data
  });


  const { data: mine = [] } = useQuery({
    queryKey: ["events"],
    queryFn: async () => (await api.get("/events")).data
  });

  const swappableMine = mine.filter(e => e.status === "SWAPPABLE");

  const requestSwap = useMutation({
    mutationFn: (payload) => api.post("/swap-request", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["market"] });
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["incoming"] });
      qc.invalidateQueries({ queryKey: ["outgoing"] });
    }
  });

  if (isLoading) return <div className="max-w-3xl mx-auto mt-6">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white rounded-xl p-4 border">
      <h3 className="font-semibold mb-3">Marketplace (Others' Swappable Slots)</h3>
      {market.length === 0 ? <p className="text-sm text-gray-600">Nothing available right now.</p> : (
        <ul className="space-y-2">
          {market.map(s=>(
            <li key={s._id} className="flex items-center justify-between border rounded-md p-3">
              <div>
                <div className="font-medium">{s.title}</div>
                <div className="text-sm text-gray-600">
                  {new Date(s.startTime).toLocaleString()} → {new Date(s.endTime).toLocaleString()}
                </div>
              </div>
              <select
                className="border rounded-md px-3 py-2 min-w-56"
                defaultValue=""
                onChange={(e)=> {
                  if(!e.target.value) return;
                  requestSwap.mutate({ mySlotId: e.target.value, theirSlotId: s._id });
                  e.target.value = "";
                }}
              >
                <option value="" disabled>Offer my swappable slot…</option>
                {swappableMine.map(m => (
                  <option key={m._id} value={m._id}>
                    {m.title} ({new Date(m.startTime).toLocaleString()})
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
