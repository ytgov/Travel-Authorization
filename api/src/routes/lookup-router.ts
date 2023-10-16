import express, { Request, Response } from "express";
import { RequiresAuth, ReturnValidationErrors } from "../middleware";
import { DB_CONFIG, AZURE_KEY } from "../config";
import knex from "knex";
import axios from "axios";
import { slice, uniq } from "lodash";
import { stringify } from "querystring";
import { LookupService } from "../services";

export const lookupRouter = express.Router();
const db = knex(DB_CONFIG);

const lookupService = new LookupService();

// lookupRouter.get("/populateEmailList", ReturnValidationErrors, async function (req: Request, res: Response) {
//   try {
//     lookupService.populateEmailList();
//     res.status(200).json("Success");
//   } catch (error: any) {
//     console.log(error);
//     res.status(500).json("Internal Server Error");
//   }
// });

const cache = new Map<string, any>();

lookupRouter.get("/emailList", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    let emailList = await axios
      .get(`https://api.gov.yk.ca/directory/employees?email=` + req.query.email, {
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_KEY
        }
      })
      .then((resp: any) => {
        let list = [];
        for (let employee of resp.data.employees) {
          if (employee.email != "") list.push(employee.email);
        }
        return list.sort();
      });
    res.status(200).json(emailList);
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

lookupRouter.get("/departments", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    let result = await db("departments").select("id", "name", "type", "ownedby").where("type", "=", "department");
    res.status(200).json(result);
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

lookupRouter.get("/branches", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    let result = await db("departments")
      .select("departments.id", "departments.name", "departments.type", "departments.ownedby", "b.name as department")
      .where("departments.type", "=", "branch")
      .innerJoin("departments as b", "departments.ownedby", "b.id");
    result.map(element => {
      element.fullName = `${element.department} - ${element.name}`;
    });
    res.status(200).json(result);
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

lookupRouter.get("/department/:id", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    let result = await db("departments")
      .select("id", "name", "type", "ownedby")
      .where("ownedby", "=", req.params.id)
      .andWhere("type", "=", "branch");
    res.status(200).json(result);
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

lookupRouter.get("/roles", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    let result = await db("roles").select("name");
    res.status(200).json(result);
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

lookupRouter.get("/departmentList", ReturnValidationErrors, async function (req: Request, res: Response) {
  if (cache.has("departmentList")) {
    return res.json(cache.get("departmentList"));
  }

  let cleanList: any = {};
  try {
    let depList = await axios
      .get(`https://api.gov.yk.ca/directory/departments`, {
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_KEY
        }
      })
      .then((resp: any) => {
        for (let slice of resp.data.divisions) {
          if (cleanList[slice.department] == null) cleanList[slice.department] = {};

          if (slice.division)
            if (cleanList[slice.department][slice.division] == null) cleanList[slice.department][slice.division] = {};

          if (slice.branch)
            if (cleanList[slice.department][slice.division][slice.branch] == null)
              cleanList[slice.department][slice.division][slice.branch] = [];

          if (slice.unit) cleanList[slice.department][slice.division][slice.branch].push(slice.unit);
        }

        return cleanList;
      });

    cache.set("departmentList", depList);

    res.status(200).json(depList);
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

lookupRouter.get("/departmentList2", ReturnValidationErrors, async function (req: Request, res: Response) {
  if (cache.has("departmentList2")) {
    return res.json({ data: cache.get("departmentList2") });
  }

  try {
    axios
      .get(`https://api.gov.yk.ca/directory/divisions`, {
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_KEY
        }
      })
      .then((resp: any) => {
        let departments = uniq(resp.data.divisions.map((d: any) => d.department));

        let result = [];

        for (let depart of departments) {
          let l1 = { name: depart, divisions: new Array() };
          result.push(l1);

          let deptList = resp.data.divisions.filter((d: any) => d.department == depart);
          let divisions = uniq(deptList.filter((d: any) => d.division != null).map((d: any) => d.division));

          for (let div of divisions as any[]) {
            let l2 = { name: div, branches: new Array() };
            l1.divisions.push(l2);

            let divList = deptList.filter((d: any) => d.division == div);
            let branches = uniq(divList.filter((d: any) => d.branch != null).map((d: any) => d.branch));

            for (let branch of branches) {
              let l3 = { name: branch, units: new Array() };
              l2.branches.push(l3);

              let branchList = divList.filter((d: any) => d.branch == branch);
              let units = uniq(branchList.filter((d: any) => d.unit != null).map((d: any) => d.unit));

              for (let unit of units) {
                l3.units.push(unit);
              }
            }
          }
        }

        cache.set("departmentList2", result);
        res.json({ data: result });
      });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

lookupRouter.get("/travelPurpose", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    let result = await db("travelPurpose").select("id", "purpose");
    res.status(200).json(result);
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

lookupRouter.get("/transportMethod", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    let result = await db("transportMethod").select("id", "method");
    res.status(200).json(result);
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

lookupRouter.get(
  "/department-branch",
  RequiresAuth,
  ReturnValidationErrors,
  async function (req: Request, res: Response) {
    let cleanList: any = {};
    try {
      let departments = await db("YgDepartments").select("*");
      const updateRequired = timeToUpdate(departments[0]);

      if(!departments[0] || updateRequired){
        await updateYgDepartments();
        departments = await db("YgDepartments").select("*");
      }

      for (const slice of departments) {
        if (cleanList[slice.department] == null)
          cleanList[slice.department] = {
            branches: []
          };

        if (slice.branch && !cleanList[slice.department].branches.includes(slice.branch))
          cleanList[slice.department].branches.push(slice.branch);
      }

      res.status(200).json(cleanList);
    } catch (error: any) {
      console.log(error);
      res.status(500).json("Internal Server Error");
    }
  }
);

lookupRouter.get("/employees", RequiresAuth, ReturnValidationErrors, async function (req: Request, res: Response) {
  const cleanList: any[] = [];
  try {
    let employees = await db("YgEmployees").select("*");
    const updateRequired = timeToUpdate(employees[0])

    if(!employees[0] || updateRequired){
      await updateYgEmployees()
      employees = await db("YgEmployees").select("*");
    }

    for (const employee of employees) {
      cleanList.push({
        firstName: employee.first_name,
        lastName: employee.last_name,
        department: employee.department,
        fullName: employee.full_name,
        email: employee.email
      });
    }
    res.status(200).json(cleanList);
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

lookupRouter.get("/employee-info", async function (req: Request, res: Response) {

  try {
    let employees = await db("YgEmployees").select("*").where("email",String(req.query.email));
    const updateRequired = timeToUpdate(employees[0])

    if(!employees[0] || updateRequired){
      await updateYgEmployees()
      employees = await db("YgEmployees").select("*").where("email",String(req.query.email));
    }

    let employeeInfo = {}
    if (employees[0]) {
      const employee = employees[0];
      employeeInfo = {
        firstName: employee.first_name,
        lastName: employee.last_name,
        department: employee.department,
        fullName: employee.full_name,
        email: employee.email,
        businessPhone: employee.phone_office,
        mobile: employee.mobile,
        office: employee.office,
        address: employee.address,
        community: employee.community,
        postalCode: employee.postal_code
      };
    }

    res.status(200).json(employeeInfo);
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

function timeToUpdate(item: any){
  const updateTime = new Date()
  //updateTime.setMinutes(updateTime.getMinutes()-1); //Update Time is 24 hours after last update
  updateTime.setDate(updateTime.getDate()-1); //Update Time is 24 hours after last update
  const lastUpdate = item?.update_date? new Date(item.update_date) : new Date('2000-01-01')
  return updateTime>lastUpdate
}

async function updateYgEmployees(){
  console.log("___________UPDATING EMPLOYEE LIST___________")
  const today = new Date();
  try {
    await axios
      .get(`https://api.gov.yk.ca/directory/employees`, {
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_KEY
        },
        timeout: 10000
      })
      .then(async (resp: any) => {
        if(resp?.data?.employees)
          await db.transaction(async trx => {
            console.log("_____START_Updating_Employees_____")
            await db("YgEmployees").del()
            await db.raw(`ALTER SEQUENCE "YgEmployees_id_seq" RESTART WITH 1;`)

            const employees = resp.data.employees
            for(const employee of employees){
              employee.update_date = today;
            }

            for(let ctt=0; ctt<employees.length; ctt=ctt+70)
              await db("YgEmployees").insert(employees.slice(ctt,ctt+70));

            console.log("_____FINISH______")
          });
      }).catch(async () => {
        console.log("_____err_____________")
        await db("YgEmployees").update({update_date: today})
      });

  } catch (error: any) {
    console.log(error);
  }
}

async function updateYgDepartments(){
  console.log("___________UPDATING DEPARTMENTS___________")
  const today = new Date();
  try {
    await axios
      .get(`https://api.gov.yk.ca/directory/divisions`, {
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_KEY
        },
        timeout: 5000
      })
      .then(async (resp: any) => {
        if(resp?.data?.divisions)
          await db.transaction(async trx => {
            console.log("_____START_Updating_Departments______")
            await db("YgDepartments").del()
            await db.raw(`ALTER SEQUENCE "YgDepartments_id_seq" RESTART WITH 1;`)

            const departments = resp.data.divisions

            for(const department of departments){
              department.update_date = today;
            }

            for(let ctt=0; ctt<departments.length; ctt=ctt+70)
              await db("YgDepartments").insert(departments.slice(ctt,ctt+70));

            console.log("_____FINISH______")
          });
      }).catch(async () => {
        console.log("_____err_____________")
        await db("YgDepartments").update({update_date: today})
      });

  } catch (error: any) {
    console.log(error);
  }
}
