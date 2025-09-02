"use client";
import React, { useState } from "react";
import AddButton from "@/components/ui/buttons/AddButton";
import DataTable from "@/components/ui/tables/DataTable";
import { teamColumns } from "@/components/ui/tables/columns";
import { useAuth } from "@/context/UserContext";
import Loading from "@/components/ui/loading/Loading";
import Input from "@/components/ui/input/Input";
import SelectBar from "@/components/ui/input/SelectBar";
import { country_list, job_titles } from "@/utils/dataTools";
import { SelectItem } from "@/components/ui/select";
import Submit from "@/components/ui/buttons/Submit";
import { toast } from "sonner";
import { useTeamData } from "@/lib/queries/queries";
import CustomInput from "@/components/ui/input/CustomInput";
import MainTitle from "@/components/ui/labels/MainTitle";
import { MemberSchema } from "@/zod/validation";
import { isValidEmail } from "@/utils/validation";
import { createClient } from "@/lib/supabase/client";
import { getFullName } from "@/utils/initials";

function MainPage() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm: "",
    location: "",
    role: "",
    job_title: "",
    hire_type: "",
  });

  const { userData } = useAuth();
  const { data } = useTeamData(userData?.team_id);
  
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const values = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      confirm: form.confirm,
      password: form.password,
      role: form.role,
      location: form.location,
      job_title: form.job_title,
      hire_type: form.hire_type,
    };

    const result = MemberSchema.safeParse(values);

    if (!result.success) {
      toast("Something went wrong", {
        description: result.error.issues[0].message,
      });

      setIsLoading(false);

      return;
    } else if (!isValidEmail(form.email)) { // CHECKS IF EMAIL IS VALID
      toast("Something went wrong", {
        description: "Please enter a valid email",
      });

      setIsLoading(false);

      return;
    } else if (form.confirm !== form.password) { // CHECKS IF PASSWORD AND CONFIRM PASSWORD MATCH EXACTLY
      toast("Something went wrong", {
        description: "Password and confirm password fields must match",
      });

      setIsLoading(false);

      return;
    }

    const {
      first_name,
      last_name,
      email,
      location,
      role,
      password,
      hire_type,
      job_title,
    } = result.data;

    try {
      if (!userData) {
        return;
      }

      // FIRST SIGN UP NEW MEMBER
      const { data: signupData, error: signupError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signupError) {
        toast("Something went wrong", {
          description: signupError.message,
        });

        return;
      }

      // IF NO ERRORS OCCUR, THEN ADD NEW MEMBER TO THE USERS TABLE
      const { error } = await supabase.from("users").insert({
        id: signupData.user?.id,
        first_name,
        last_name,
        full_name: getFullName(first_name, last_name),
        location,
        role,
        hire_type,
        job_title,
        team_id: userData.team_id,
      });

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        return;
      }

      // NOTIFY ADMIN THAT THE NEW MEMBER WOULD NEED TO VERIFY THEIR ACCOUNT
      // BEFORE LOGIN
      toast("Success!", {
        description:
          "A new member was successfuly added to the team! An email will be sent to this member to veryify their email address before logging in.",
      });
    } catch (err: any) {
      toast("Something went wrong", {
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        {data?.team_data ? (
          <MainTitle title={data?.team_name} data={data.team_data} />
        ) : null}
        <div className="flex items-start gap-5 mb-8 text-lightText"></div>
        <AddButton
          title={"member"}
          desc={"Create a new team member"}
          setOpen={setOpen}
          open={open}
        >
          <form onSubmit={handleSubmit}>
            {/* FIRST NAME */}
            <Input
              htmlFor={"first_name"}
              type="text"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              label={"First name *"}
              name="first_name"
              id="first_name"
            />

            {/* LAST NAME */}
            <Input
              htmlFor={"last_name"}
              type="text"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              label={"Last name *"}
              name="last_name"
              id="last_name"
              className="mt-3"
            />
            {/* EMAIL */}
            <Input
              htmlFor={"email"}
              type="text"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              label={"Email *"}
              name="email"
              id="email"
              className="mt-3"
            />
            <div className="flex gap-4 items-start mt-3">
              {/* PASSWORD */}
              <Input
                htmlFor={"password"}
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                label={"Password *"}
                name="password"
                id="password"
                className="flex-1"
              />
              {/* CONFIRM PASSWORD */}
              <Input
                htmlFor={"confirm_password"}
                label={"Confirm password *"}
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                name="confirm"
                id="confirm"
                className="flex-1"
              />
            </div>
            {/* LOCATION */}
            <CustomInput htmlFor={""} label={"Location"} className="mt-5">
              <SelectBar
                name="location"
                placeholder={"Select member's location *"}
                label={"Countries"}
                className="mt-1.5"
                value={form.location}
                valueChange={(name) => setForm({ ...form, location: name })}
              >
                {country_list.map((item) => {
                  return (
                    <SelectItem value={item.name} key={item.code}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </CustomInput>
            {/* JOB TITLE */}
            <CustomInput label="Occupation" htmlFor="" className="mt-5">
              <SelectBar
                name="job_title"
                placeholder={"Select a job title *"}
                label={"Job title"}
                className="mt-1.5"
                value={form.job_title}
                valueChange={(name) => setForm({ ...form, job_title: name })}
              >
                {job_titles.map((item) => {
                  return (
                    <SelectItem value={item} key={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </CustomInput>
            {/* ROLES */}
            <CustomInput label="Role" htmlFor="" className="mt-5">
              <SelectBar
                name="role"
                placeholder={"Select a role *"}
                label={"Roles"}
                className="mt-1.5"
                value={form.role}
                valueChange={(name) => setForm({ ...form, role: name })}
              >
                {["Viewer", "Admin"].map((item) => {
                  return (
                    <SelectItem value={item} key={item} className="capitalize">
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </CustomInput>
            {/* HIRE TYPE */}
            <CustomInput htmlFor={""} label={"Hire type"} className="mt-5">
              <SelectBar
                name="hire_type"
                placeholder={"Select a hire type *"}
                label={"Hire type"}
                className="mt-1.5"
                value={form.hire_type}
                valueChange={(name) => setForm({ ...form, hire_type: name })}
              >
                {["Employee", "Contractor", "Independent", "Employer"].map(
                  (item) => {
                    return (
                      <SelectItem
                        value={item}
                        key={item}
                        className="capitalize"
                      >
                        {item}
                      </SelectItem>
                    );
                  }
                )}
              </SelectBar>
            </CustomInput>
            {/* SUBMIT BUTTON */}
            <div className="flex justify-end mt-6">
              <Submit loading={isLoading} disabledLogic={isLoading} />
            </div>
          </form>
        </AddButton>
      </div>
      <div>
        {!data?.team_data ? (
          <div className="py-8 flex justify-center">
            <Loading className="w-10 h-10" />
          </div>
        ) : (
          <DataTable
            columns={teamColumns}
            data={data.team_data}
            is_payment={false}
            team_name={data.team_name}
            advanced
            is_export
            filterCategory={"full_name"}
          />
        )}
      </div>
    </div>
  );
}

export default MainPage;
