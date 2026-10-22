const PHASES = [
  { focus: "Cloud Concepts", tasks: ["Cloud models: public, private, hybrid", "IaaS vs PaaS vs SaaS", "CapEx vs OpEx & shared responsibility"] },
  { focus: "Core Architecture", tasks: ["Regions, region pairs & Availability Zones", "Subscriptions, management & resource groups", "Azure Resource Manager"] },
  { focus: "Compute & Networking", tasks: ["VMs, containers & Azure Functions", "VNets, peering, VPN Gateway, ExpressRoute", "Load Balancer & DNS"] },
  { focus: "Storage & Identity", tasks: ["Storage tiers & redundancy", "Microsoft Entra ID, MFA & RBAC", "Zero Trust & defence in depth"] },
  { focus: "Management & Governance", tasks: ["Azure Policy, locks & tags", "Cost management, TCO & pricing calculators", "Azure Arc, Monitor & Advisor"] },
  { focus: "Review & Mock Exams", tasks: ["Full quizzes across all pillars", "Drill your Hard flashcards", "Revisit weakest pillar"] },
];

export function buildPlan(start: Date, exam: Date, hoursPerDay: number) {
  const days = Math.max(1, Math.ceil((exam.getTime() - start.getTime()) / 86400000));
  const weekCount = Math.max(1, Math.ceil(days / 7));
  const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const weeks = Array.from({ length: weekCount }, (_, i) => {
    // Spread phases across weeks; last week is always review.
    const phase = i === weekCount - 1 ? PHASES[5]! : PHASES[Math.floor((i * 5) / Math.max(1, weekCount - 1))]!;
    const s = new Date(start.getTime() + i * 7 * 86400000);
    const daysInWeek = Math.min(7, days - i * 7);
    const e = new Date(s.getTime() + (daysInWeek - 1) * 86400000);
    return { week: i + 1, range: `${fmt(s)} – ${fmt(e)}`, focus: phase.focus, tasks: phase.tasks, hours: +(daysInWeek * hoursPerDay).toFixed(1) };
  });
  return { days, weeks, totalHours: +(days * hoursPerDay).toFixed(1) };
}
