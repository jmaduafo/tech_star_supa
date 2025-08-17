"use client"
import Header1 from '@/components/fontsize/Header1';
import Header6 from '@/components/fontsize/Header6';
import AddButton from '@/components/ui/buttons/AddButton';
import Submit from '@/components/ui/buttons/Submit';
import CustomInput from '@/components/ui/input/CustomInput';
import SelectBar from '@/components/ui/input/SelectBar';
import AdvancedSearch from '@/components/ui/search/AdvancedSearch';
import { country_list, months } from '@/utils/dataTools';
import { optionalS } from '@/utils/optionalS';
import { SelectItem } from '@/components/ui/select';
import Input from '@/components/ui/input/Input';
import React, { useState } from 'react'
import ProjectDisplay from '../../ProjectDisplay';
import { Contractor } from '@/types/types';
import ContractorDisplay from './ContractorDisplay';
import { useAuth } from '@/context/UserContext';

function MainPage() {
    const [ filteredContractors, setFiltereredContractors ] = useState<Contractor[] | undefined>()
    const [ allContractors, setAllContractors ] = useState<Contractor[] | undefined>()

    const [sort, setSort] = useState("");
      const [searchValue, setSearchValue] = useState("");
    
      const [isLoading, setIsLoading] = useState(false);
      const [open, setOpen] = useState(false);
    
      const [form, setForm] = useState({
        name: "",
        city: "",
        country: "",
        month: "",
        year: 2025,
      });

      const { userData } = useAuth()

  return (
    <div>
      <div className="flex items-start gap-5 mb-8 text-lightText">
        <Header1 text="All Contractors" />
        {filteredContractors ? (
          <Header6
            text={`${filteredContractors.length} result${optionalS(
              filteredContractors.length
            )}`}
          />
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <AdvancedSearch
            user={userData}
            setSort={setSort}
            sort={sort}
            setValue={setSearchValue}
            value={searchValue}
          />
        </div>
        <AddButton setOpen={setOpen} open={open} title={"project"} desc={""}>
          <form>
            {/* PROJECT NAME */}
            <Input
              label="Project name *"
              htmlFor="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              name={"name"}
              id="name"
            />
            <Input
              label="City"
              htmlFor="city"
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              name={"city"}
              id="city"
              className="mt-3"
            />
            <div className="flex items-center gap-4 mt-5">
              {/* COUNTRY LOCATION */}
              <SelectBar
                placeholder="Select country *"
                value={form.country}
                valueChange={(name) => setForm({ ...form, country: name })}
                label="Countries"
                className="flex-1"
              >
                {country_list.map((item) => {
                  return (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectBar>
              <SelectBar
                placeholder="Starting month *"
                value={form.month}
                valueChange={(name) => setForm({ ...form, month: name })}
                label="Months"
                className="flex-1"
              >
                {months.map((item) => {
                  return (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </div>
            <CustomInput htmlFor={"year"} label={"Year *"} className="mt-3">
              <input
                type="number"
                value={form.year}
                onChange={(e) =>
                  setForm({ ...form, year: e.target.valueAsNumber })
                }
                name="year"
                id="year"
                className="form"
                min={1900}
                max={new Date().getFullYear()}
              />
            </CustomInput>

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end mt-6">
              <Submit loading={isLoading} disabledLogic={isLoading} />
            </div>
          </form>
        </AddButton>
      </div>
      {/* <div className="mt-10">
        <ContractorDisplay
          user={userData}
          allProjects={filteredContractors}
          setAllProjects={setAllContractors}
        />
      </div> */}
    </div>
  )
}

export default MainPage