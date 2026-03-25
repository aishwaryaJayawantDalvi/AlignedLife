import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { getSocket } from "../hooks/socket";
import { useAuth } from "../context/AuthContext";
import { buildAvatarUrl } from "../utils/avatar";

const ChatPage = () => {
  const { matchId, partnerId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [warning, setWarning] = useState("");
  const [myAvatar, setMyAvatar] = useState({ style: "lorelei-neutral", seed: "me" });
  const [partnerAvatar, setPartnerAvatar] = useState({ style: "lorelei-neutral", seed: "partner" });

  useEffect(() => {
    const load = async () => {
      const [{ data: chatData }, { data: profileData }, { data: matchData }] = await Promise.all([
        api.get(`/chats/${matchId}/messages`),
        api.get("/profile/me"),
        api.get("/matches")
      ]);

      setMessages(chatData);

      if (profileData) {
        setMyAvatar({
          style: profileData.avatarStyle || "lorelei-neutral",
          seed: profileData.avatarSeed || String(user?.username || "me")
        });
      }

      const currentMatch = matchData.find((m) => String(m.id) === String(matchId) || String(m.partner.id) === String(partnerId));
      if (currentMatch?.partner) {
        setPartnerAvatar({
          style: currentMatch.partner.avatarStyle || "lorelei-neutral",
          seed: currentMatch.partner.avatarSeed || String(currentMatch.partner.username || "partner")
        });
      }
    };

    load();

    const socket = getSocket();
    socket.emit("join-match", matchId);
    const onMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.warning) setWarning(msg.warning);
    };

    socket.on("new-message", onMessage);
    return () => socket.off("new-message", onMessage);
  }, [matchId, partnerId, user?.username]);

  const send = async () => {
    if (!content.trim()) return;
    const socket = getSocket();
    socket.emit("send-message", { matchId, content });
    setContent("");
  };

  const sorted = useMemo(
    () => [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [messages]
  );

  return (
    <div className="card p-4 h-[70vh] flex flex-col">
      <h1 className="text-xl font-bold">Anonymous Chat</h1>
      <p className="text-xs text-slate-400">Talk using avatars and shared values, not personal photos.</p>
      {warning && <p className="text-amber text-sm mt-2">{warning}</p>}

      <div className="flex-1 overflow-y-auto mt-4 space-y-2">
        {sorted.map((msg) => {
          const mine = String(msg.senderId) === String(user.id);
          const avatar = mine ? myAvatar : partnerAvatar;
          return (
            <div key={msg._id} className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}>
              {!mine && (
                <img
                  src={buildAvatarUrl(avatar.style, avatar.seed)}
                  alt="Partner avatar"
                  className="h-7 w-7 rounded-md border border-slate-600 bg-slate-900"
                />
              )}
              <div className={`max-w-[78%] rounded-xl px-3 py-2 text-sm ${mine ? "bg-glow text-ink" : "bg-slate-800"}`}>
                {msg.content}
              </div>
              {mine && (
                <img
                  src={buildAvatarUrl(avatar.style, avatar.seed)}
                  alt="My avatar"
                  className="h-7 w-7 rounded-md border border-slate-600 bg-slate-900"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <input className="input" placeholder="Type a message" value={content} onChange={(e) => setContent(e.target.value)} />
        <button className="btn-primary" onClick={send}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
