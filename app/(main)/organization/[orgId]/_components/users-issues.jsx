// import { getUserIssues } from "@/actions/issues";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import IssueCard from "@/components/issue-card";

// export default async function UserIssues({ userId }) {
//   const issues = await getUserIssues(userId);

//   if (issues.length === 0) {
//     return null;
//   }

//   const assignedIssues = issues.filter(
//     (issue) => issue.assignee?.clerkUserId === userId
//   );

//   const reportedIssues = issues.filter(
//     (issue) => issue.reporter?.clerkUserId === userId
//   );

//   return (
//     <>
//       <h1 className="text-4xl font-bold gradient-title mb-4">My Issues</h1>
//       <Tabs defaultValue="assigned" className="w-full">
//         <TabsList>
//           <TabsTrigger value="assigned">
//             Assigned to You ({assignedIssues.length})
//           </TabsTrigger>
//           <TabsTrigger value="reported">
//             Reported by You ({reportedIssues.length})
//           </TabsTrigger>
//         </TabsList>
//         <TabsContent value="assigned">
//           <IssueGrid issues={assignedIssues} />
//         </TabsContent>
//         <TabsContent value="reported">
//           <IssueGrid issues={reportedIssues} />
//         </TabsContent>
//       </Tabs>
//     </>
//   );
// }

// function IssueGrid({ issues }) {
//   console.log("Issues in IssueGrid:", issues);

//   if (issues.length === 0) {
//     return <div>No issues found</div>;
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {issues.map((issue) => (
//         <IssueCard key={issue.id} issue={issue} showStatus />
//       ))}
//     </div>
//   );
// }

import { getUserIssues } from "@/actions/issues";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IssueCard from "@/components/issue-card";

export default async function UserIssues({ userId }) {
  const issues = await getUserIssues(userId);

  // Debug: Log the raw data
  console.log("=== UserIssues Debug ===");
  console.log("userId:", userId);
  console.log("Total issues:", issues?.length || 0);
  console.log("First issue sample:", issues?.[0]);

  if (!issues || issues.length === 0) {
    return null;
  }

  // More flexible filtering - check multiple possible field structures
  const assignedIssues = issues.filter((issue) => {
    // Check various possible structures
    const assigneeId =
      issue.assignee?.clerkUserId || issue.assigneeId || issue.assignee?.id;

    console.log(
      "Checking assigned - Issue:",
      issue.id,
      "AssigneeId:",
      assigneeId,
      "UserId:",
      userId
    );
    return assigneeId === userId;
  });

  const reportedIssues = issues.filter((issue) => {
    // Check various possible structures
    const reporterId =
      issue.reporter?.clerkUserId || issue.reporterId || issue.reporter?.id;

    console.log(
      "Checking reported - Issue:",
      issue.id,
      "ReporterId:",
      reporterId,
      "UserId:",
      userId
    );
    return reporterId === userId;
  });

  console.log("Assigned issues count:", assignedIssues.length);
  console.log("Reported issues count:", reportedIssues.length);

  return (
    <>
      <h1 className="text-4xl font-bold gradient-title mb-4">My Issues</h1>
      <Tabs defaultValue="assigned" className="w-full">
        <TabsList>
          <TabsTrigger value="assigned">
            Assigned to You ({assignedIssues.length})
          </TabsTrigger>
          <TabsTrigger value="reported">
            Reported by You ({reportedIssues.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="assigned">
          <IssueGrid issues={assignedIssues} />
        </TabsContent>
        <TabsContent value="reported">
          <IssueGrid issues={reportedIssues} />
        </TabsContent>
      </Tabs>
    </>
  );
}

function IssueGrid({ issues }) {
  console.log("IssueGrid received:", issues?.length || 0, "issues");

  if (!issues || issues.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No issues found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} showStatus />
      ))}
    </div>
  );
}
