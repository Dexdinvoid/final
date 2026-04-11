import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  // Get all conversations for this user
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ user1Id: authUser.id }, { user2Id: authUser.id }],
    },
    include: {
      user1: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      user2: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Get friends list for starting new conversations
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [{ user1Id: authUser.id }, { user2Id: authUser.id }],
    },
    include: {
      user1: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      user2: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
    },
  });

  const friends = friendships.map((f) =>
    f.user1Id === authUser.id ? f.user2 : f.user1
  );

  const conversationPartnerIds = new Set(
    conversations.map((c) =>
      c.user1Id === authUser.id ? c.user2Id : c.user1Id
    )
  );

  const friendsWithoutConvo = friends.filter(
    (f) => !conversationPartnerIds.has(f.id)
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Messages
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Chat with your friends
        </p>
      </div>

      {/* Conversations List */}
      <div className="space-y-3">
        {conversations.length === 0 && friendsWithoutConvo.length === 0 ? (
          <div className="glass-card rounded-[2rem] p-12 text-center border-primary/10">
            <span className="material-icons-round text-6xl text-primary/20 mb-4 block">
              chat_bubble_outline
            </span>
            <p className="text-white/60 font-medium text-lg">No messages yet</p>
            <p className="text-slate-500 text-sm mt-2">
              Add friends to start chatting!
            </p>
            <Link
              href="/friends"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full neon-gradient text-navy-deep font-bold text-sm neon-glow hover:-translate-y-0.5 transition-all"
            >
              <span className="material-icons-round text-lg">group_add</span>
              Find Friends
            </Link>
          </div>
        ) : (
          <>
            {/* Existing conversations */}
            {conversations.map((conv) => {
              const other =
                conv.user1Id === authUser.id ? conv.user2 : conv.user1;
              const lastMsg = conv.messages[0];
              return (
                <Link
                  key={conv.id}
                  href={`/messages/${other.username}`}
                  className="glass-card rounded-2xl p-4 border-primary/10 flex items-center gap-4 hover:border-primary/30 transition-all group"
                >
                  {other.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={other.avatarUrl}
                      alt={other.username}
                      className="w-12 h-12 rounded-full border-2 border-primary/30 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full neon-gradient flex items-center justify-center text-navy-deep font-bold text-lg shrink-0">
                      {(other.displayName || other.username)
                        .slice(0, 1)
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold group-hover:text-primary transition-colors">
                      {other.displayName || other.username}
                    </p>
                    <p className="text-slate-500 text-sm truncate">
                      {lastMsg
                        ? lastMsg.body.length > 60
                          ? lastMsg.body.slice(0, 60) + "..."
                          : lastMsg.body
                        : "No messages yet"}
                    </p>
                  </div>
                  {lastMsg && (
                    <span className="text-xs text-slate-600 shrink-0">
                      {new Date(lastMsg.createdAt).toLocaleDateString()}
                    </span>
                  )}
                  <span className="material-icons-round text-slate-600 group-hover:text-primary transition-colors">
                    chevron_right
                  </span>
                </Link>
              );
            })}

            {/* Friends without conversations */}
            {friendsWithoutConvo.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Start a conversation
                </h3>
                <div className="space-y-2">
                  {friendsWithoutConvo.map((friend) => (
                    <Link
                      key={friend.id}
                      href={`/messages/${friend.username}`}
                      className="glass-panel rounded-xl p-3 flex items-center gap-3 hover:border-primary/20 border border-transparent transition-all group"
                    >
                      {friend.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={friend.avatarUrl}
                          alt={friend.username}
                          className="w-10 h-10 rounded-full border border-primary/20 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {(friend.displayName || friend.username)
                            .slice(0, 1)
                            .toUpperCase()}
                        </div>
                      )}
                      <p className="text-white/70 font-medium group-hover:text-primary transition-colors">
                        {friend.displayName || friend.username}
                      </p>
                      <span className="material-icons-round text-slate-600 group-hover:text-primary ml-auto transition-colors text-sm">
                        chat
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
