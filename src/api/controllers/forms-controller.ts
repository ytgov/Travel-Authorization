import BaseController from "./base-controller";

export class FormsController extends BaseController {
  create() {
    console.log("this.request.body", this.request.body)
    // try {
    //   await db.transaction(async trx => {
    //     let user = await userService.getByEmail(req.user.email);
    //     let form = await formService.getForm(req.params.formId);

    //     if (!form || (form && form.userId === user.id)) {
    //       const result = await formService.submitForm(user.id, req.body);
    //       if (result) {
    //         auditService.log(user.id, form.id, "Submit", "Form submitted successfully.");
    //         res.status(200).json("Form submitted");
    //       } else {
    //         auditService.log(user.id, form?.id, "Submit", "Form did not submit successfully.");
    //         res.status(422).json("Form submission failed");
    //       }
    //     } else {
    //       auditService.log(user.id, 0, "Submit", "Form does not exist or user lacking permissions on form.");
    //       res.status(404).json("Form not found");
    //     }
    //   });
    // } catch (error: any) {
    //   console.log(error);
    //   res.status(500).json("Form submission failed");
    // }
  }
}

export default FormsController;
