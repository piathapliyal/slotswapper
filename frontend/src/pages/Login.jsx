import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login(){
  const nav = useNavigate();
  const [f, setF] = useState({ email:"", password:"" });
  const [err, setErr] = useState("");

  async function submit(e){
    e.preventDefault();
    setErr("");
    try{
      const { data } = await api.post("/auth/login", f);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      nav("/dashboard");
    }catch(e){
      setErr(e?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl p-4 border">
      <h2 className="text-xl font-semibold mb-4">Log in</h2>
      {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input className="border rounded-md px-3 py-2" placeholder="Email"
               value={f.email} onChange={e=>setF({...f, email:e.target.value})}/>
        <input className="border rounded-md px-3 py-2" type="password" placeholder="Password"
               value={f.password} onChange={e=>setF({...f, password:e.target.value})}/>
        <button className="bg-black text-white rounded-md px-3 py-2 hover:opacity-90">Login</button>
      </form>
      <p className="text-sm text-gray-600 mt-3">
        No account? <Link to="/signup" className="underline">Sign up</Link>
      </p>
    </div>
  );
}
