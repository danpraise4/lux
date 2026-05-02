import { isDbConfigured, connectDB } from "@/lib/mongodb";
import EmailLog from "@/models/EmailLog";
import { FollowUpEmailForm } from "@/components/admin/follow-up-email-form";
import { envResendApiKey } from "@/lib/server-env";

export default async function AdminEmailsPage() {
  let logs: { id: string; to: string; subject: string; ok: boolean; createdAt?: Date | null }[] = [];
  if (isDbConfigured()) {
    const c = await connectDB();
    if (c) {
      const found = await EmailLog.find().sort({ createdAt: -1 }).limit(40).lean();
      logs = found.map((e: unknown) => {
        const raw = e as {
          _id: { toString: () => string };
          to: string[];
          subject: string;
          ok: boolean;
          createdAt?: Date;
        };
        return {
          id: raw._id.toString(),
          to: raw.to.join(", "),
          subject: raw.subject,
          ok: raw.ok,
          createdAt: raw.createdAt,
        };
      });
    }
  }

  const mailConfigured = Boolean(envResendApiKey());

  return (
    <div className="min-w-0 space-y-8">
      <div>
        <h1 className="font-serif text-2xl">Follow-up emails</h1>
        <p className="mt-2 max-w-prose text-sm text-zinc-600">
          Send messages to guests after an enquiry or booking. Use the form below — recent activity appears in the table.
        </p>
        <p
          className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            mailConfigured ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-950"
          }`}
        >
          {mailConfigured ? "Sending email is turned on" : "Sending email isn’t available — ask your administrator"}
        </p>
      </div>

      <FollowUpEmailForm />

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="font-semibold text-zinc-900">Recent activity</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-zinc-100 text-xs uppercase text-zinc-600">
              <tr>
                <th className="p-2">When</th>
                <th className="p-2">To</th>
                <th className="p-2">Subject</th>
                <th className="p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-zinc-50 align-top">
                  <td className="whitespace-nowrap p-2 text-zinc-600">
                    {log.createdAt instanceof Date ? log.createdAt.toLocaleString() : "—"}
                  </td>
                  <td className="max-w-48 break-all p-2 text-xs">{log.to}</td>
                  <td className="p-2">{log.subject}</td>
                  <td className={`p-2 ${log.ok ? "text-emerald-700" : "text-red-600"}`}>{log.ok ? "Sent" : "Failed"}</td>
                </tr>
              ))}
              {!logs.length && (
                <tr>
                  <td className="p-6 text-zinc-600" colSpan={4}>
                    No messages logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
