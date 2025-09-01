"use client";
import React, { useState, useEffect } from "react";
import AddButton from "@/components/ui/buttons/AddButton";
import DataTable from "@/components/ui/tables/DataTable";
import { teamColumns } from "@/components/ui/tables/columns";
import { User } from "@/types/types";
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

function MainPage() {
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { userData } = useAuth();

  const { data } = useTeamData(userData?.team_id);

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
          <form>
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
                {["Viewer", "Editor", "Admin"].map((item) => {
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
                {["Employee", "Contractor", "Independent"].map((item) => {
                  return (
                    <SelectItem value={item} key={item} className="capitalize">
                      {item}
                    </SelectItem>
                  );
                })}
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
