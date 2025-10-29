"use client";
import { createIssue } from "@/actions/issues";
import { getOrganizationUsers } from "@/actions/organizations";
import { issueSchema } from "@/app/lib/validators";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/usefetch";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";

const IssueCreationDrawer = ({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
      title: "",
    },
  });

  const {
    loading: createIssueLoading,
    fn: createIssueFn,
    error,
    data: newIssue,
  } = useFetch(createIssue);

  const {
    loading: usersLoading,
    fn: fetchUsers,
    data: users,
  } = useFetch(getOrganizationUsers);

  // Debug logging - YEH CONSOLE CHECK KARO
  useEffect(() => {
    console.log("=== Debug Info ===");
    console.log("isOpen:", isOpen);
    console.log("orgId:", orgId);
    console.log("orgId type:", typeof orgId);
    console.log("users:", users);
    console.log("usersLoading:", usersLoading);
  }, [isOpen, orgId, users, usersLoading]);

  // Fetch users when drawer opens
  useEffect(() => {
    if (isOpen && orgId) {
      console.log("🚀 Attempting to fetch users for orgId:", orgId);
      fetchUsers(orgId)
        .then(() => {
          console.log("✅ Users fetch call completed");
        })
        .catch((err) => {
          console.error("❌ Error in fetchUsers:", err);
        });
    } else {
      console.log("❌ Cannot fetch - isOpen:", isOpen, "orgId:", orgId);
    }
  }, [isOpen, orgId]);

  useEffect(() => {
    if (newIssue) {
      reset();
      onClose();
      onIssueCreated();
      toast.success("Issue created successfully!");
    }
  }, [newIssue]);

  const onSubmit = async (data) => {
    // inside onSubmit
    await createIssueFn(projectId, {
      ...data,
      assigneeId: data.assigneeId || null,
      status,
      sprintId, // cast to Number if your API needs it
    });
  };

  return (
    <div>
      <Drawer open={isOpen} onClose={onClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create New Issue</DrawerTitle>
          </DrawerHeader>
          {usersLoading && <BarLoader width={"100%"} color="#36d7b7" />}

          <form className="p-4 space-y-2" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="assigneeId"
                className="block text-sm font-medium mb-1"
              >
                Assignee
              </label>
              <Controller
                name="assigneeId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""} // controlled
                    onValueChange={(v) => field.onChange(v)} // v is a string (uuid)
                    disabled={usersLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.assigneeId && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.assigneeId.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <MDEditor value={field.value} onChange={field.onChange} />
                )}
              />
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium mb-1"
              >
                Priority
              </label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {error && <p className="text-red-500 mt-2">{error.message}</p>}

            <Button
              type="submit"
              disabled={createIssueLoading}
              className="w-full"
            >
              {createIssueLoading ? "Creating..." : "Create Issue"}
            </Button>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default IssueCreationDrawer;
