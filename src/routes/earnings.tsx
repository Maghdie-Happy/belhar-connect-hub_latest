import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/ui-kit";
import { rand, transactions, weeklyEarnings } from "@/lib/data";
import { usePaymentMethods } from "@/lib/hooks";
import { toast } from "sonner";

export const Route = createFileRoute("/earnings")({
  head: () => ({
    meta: [
      { title: "Earnings — Connectly" },
      {
        name: "description",
        content: "Track what you've earned this week, view transactions and withdraw on Connectly.",
      },
      { property: "og:title", content: "Earnings — Connectly" },
      { property: "og:description", content: "Your Connectly income in Rand." },
    ],
  }),
  component: Earnings,
});

function Earnings() {
  const max = Math.max(...weeklyEarnings.map((d) => d.amount));
  const week = weeklyEarnings.reduce((s, d) => s + d.amount, 0);
  const { methods } = usePaymentMethods();
  const defaultMethod = methods.find((method) => method.isDefault) ?? methods[0];

  const handleWithdraw = () => {
    if (!defaultMethod) {
      toast.error("Add a payment method in Settings before withdrawing.");
      return;
    }
    toast.success(`Withdrawal requested to ${defaultMethod.name}.`);
  };

  return (
    <AppShell
      role="worker"
      title="Earnings"
      subtitle="Paid out every Friday"
      action={<button onClick={handleWithdraw} className="btn-primary">Withdraw Earnings</button>}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total earned" value="R23 850" hint="Since March 2026" icon="💰" />
        <StatCard label="This week" value={rand(week)} hint="6 jobs" icon="📈" />
        <StatCard label="Available to withdraw" value="R2 730" hint="Cleared funds" icon="🏦" />
      </div>

      <div className="card-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold">Payout method</h2>
            <p className="text-sm text-muted-foreground">
              {defaultMethod ? `${defaultMethod.name} · ${defaultMethod.details}` : "No payment method added yet."}
            </p>
          </div>
          <Link to="/settings" className="btn-secondary !h-10 !px-4 !text-sm">
            Manage payment methods
          </Link>
        </div>
      </div>

      <div className="card-surface p-6">
        <h2 className="font-display text-lg font-bold">This week</h2>
        <div className="mt-6 flex h-48 items-end gap-3">
          {weeklyEarnings.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                {d.amount ? rand(d.amount) : ""}
              </span>
              <div
                className="w-full rounded-t-lg bg-[linear-gradient(180deg,var(--primary),var(--primary-dark))]"
                style={{ height: `${max ? (d.amount / max) * 100 : 0}%`, minHeight: 4 }}
              />
              <span className="text-xs text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <h2 className="border-b border-border p-5 font-display text-lg font-bold">Transactions</h2>
        <ul className="divide-y divide-border">
          {transactions.map((t) => (
            <li key={t.job} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 p-4">
              <span className="min-w-0">
                <span className="block truncate font-semibold">{t.job}</span>
                <span className="block text-xs text-muted-foreground">
                  {t.client} · {t.date}
                </span>
              </span>
              <span className="shrink-0 font-display font-bold text-primary">+{rand(t.amount)}</span>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
