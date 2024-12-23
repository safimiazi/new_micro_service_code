import { ENV } from "@/config/env";

const visaFormTemplate = async ( ) => {
  return `
      <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Form V39A</title>
    <style>
      /* Set up the A4 size */
      @page {
        size: A4;
        margin: 0;
      }

      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .container {
        width: 210mm;
        /* height: 297mm; */
        padding: 20mm;
        margin: 40px auto;
        /* border: 1px solid #000; */
        border-collapse: collapse;
      }

      td {
        padding: 10px;
        font-size: 12pt;
      }

      .header {
        display: flex;
        align-items: flex-start;
      }
      .common_padding {
        padding: 0px 40px 0px 40px;
      }
      .common_input-bg {
        background-color: transparent
      }

      .header div:last-child {
        margin-left: auto;
      }
      .signature-sentance {
        font-size: 15px;
      }
    </style>
  </head>
  <body>
    <table class="container">
      <tr>
        <td>
          <div class="header common_padding" style="margin-bottom: 10px">
            <div>Controller of Immigration<br />Singapore</div>
            <div style="display: flex">
              <span>Date:</span
              ><span
                class="common_input-bg"
                style="width: 100px; border-bottom: black solid 1px"
              ></span>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="common_padding">
            <div>Dear Sir</div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="common_padding" style="margin-bottom: 10px">
            <h4 style="text-align: center; font-weight: normal;">
              LETTER OF INTRODUCTION FOR VISA APPLICATION
            </h4>
          </div>
        </td>
      </tr>
      <!-- <tr style="margin-bottom: 10px">
        <td>
          <div
            class="common_padding"
            style="margin-bottom: 10px; text-align: justify"
          >
            <div style="display: flex">
              <span>The applicant for the visa,</span
              ><span
                class="common_input-bg"
                style="width: 353px; border-bottom: black solid 1px"
              ></span>
              <span>(name of applicant) of</span>
            </div>
            <div style="display: flex">
              <span
                class="common_input-bg"
                style="width: 302px; border-bottom: black solid 1px"
              ></span>
              <span
                >(country/place), holder of passport/travel document no.</span
              >
            </div>
            <div style="display: flex">
              <span
                class="common_input-bg"
                style="width: 302px; border-bottom: black solid 1px"
              ></span>
              <span style="text-align: justify"
                >is coming to Singapore from</span
              >
            </div>
            <div style="display: flex">
              <span
                class="common_input-bg"
                style="width: 345px; border-bottom: black solid 1px"
              ></span>
              <span style="text-align: justify"
                >(country/place of embarkation) for the purpose of</span
              >
            </div>
            <div style="display: flex">
              <span
                class="common_input-bg"
                style="width: 330px; border-bottom: black solid 1px"
              ></span>
              <span style="text-align: justify"
                >(e.g., holiday, transit, business, meeting, exhibition,</span
              >
            </div>
            <div style="display: flex">
              <span
                >visiting friends & relatives, employment, education; for
                others, please specify). The</span
              >
            </div>
            <div style="display: flex">
              <span>applicant is my</span>
              <span
                class="common_input-bg"
                style="width: 200px; border-bottom: black solid 1px"
              ></span>
              <span> (e.g., father, mother, brother, sister, son,</span>
            </div>
            <div style="display: flex">
              <span
                >daughter, spouse, business partner; for others, please
                specify).
              </span>
            </div>
          </div>
        </td>
      </tr> -->
      <tr style="margin-bottom: 10px">
        <td>
          <div class="common_padding" style="margin-bottom: 10px">
            <div style="display: flex; justify-content: space-between; text-align: justify; margin-bottom: 10px;">
              <span>The applicant for the visa,</span>
              <span class="common_input-bg" style="width: 353px; border-bottom: black solid 1px"></span>
              <span>(name of applicant) of</span>
            </div>
            <div style="display: flex; justify-content: space-between; text-align: justify; margin-bottom: 10px;">
              <span class="common_input-bg" style="width: 302px; border-bottom: black solid 1px"></span>
              <span>(country/place), holder of passport/travel document no.</span>
            </div>
            <div style="display: flex; justify-content: space-between; text-align: justify; margin-bottom: 10px;">
              <span class="common_input-bg" style="width: 302px; border-bottom: black solid 1px"></span>
              <span >is coming to Singapore from</span>
            </div>
            <div style="display: flex; justify-content: space-between; text-align: justify; margin-bottom: 10px;">
              <span class="common_input-bg" style="width: 345px; border-bottom: black solid 1px"></span>
              <span>(country/place of embarkation) for the purpose of</span>
            </div>
            <div style="display: flex; justify-content: space-between; text-align: justify; margin-bottom: 10px;">
              <span class="common_input-bg" style="width: 330px; border-bottom: black solid 1px"></span>
              <span>(e.g., holiday, transit, business, meeting, exhibition,</span>
            </div>
            <div style="display: flex; justify-content: space-between; text-align: justify; margin-bottom: 10px;">
              <span>visiting friends & relatives, employment, education; for others, please specify). The</span>
            </div>
            <div style="display: flex; justify-content: space-between; text-align: justify; margin-bottom: 10px;">
              <span>applicant is my</span>
              <span class="common_input-bg" style="width: 280px; border-bottom: black solid 1px"></span>
              <span>(e.g., father, mother, brother, sister, son,</span>
            </div>
            <div style="display: flex; justify-content: space-between; text-align: justify; margin-bottom: 10px;">
              <span>daughter, spouse, business partner; for others, please specify).</span>
            </div>
          </div>
        </td>
      </tr>
      
      <tr>
        <td>
          <div
            style="margin-bottom: 15px; margin-top: 15px"
            class="common_padding"
          >
            Yours faithfully
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div
            class="common_padding"
            style="
              text-decoration: underline;
              font-weight: bold;
              margin-bottom: 15px;
            "
          >
            Only for application where Local Contact is an individual:
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div
            class="common_padding"
            style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
            "
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: center;
              "
            >
              <!-- <div>OCT 15, 1524</div> -->
              <div
                style="
                  border-bottom: 1px solid black;
                  width: 290px;
                  height: 15px;
                "
              ></div>
              <div class="signature-sentance">Signature of Local Contact</div>
            </div>
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: center;
              "
            >
              <!-- <div>OCT 15, 1524</div> -->
              <div
                class="common_input-bg"
                style="
                  border-bottom: 1px solid black;
                  width: 290px;
                  height: 15px;
                "
              ></div>
              <div class="signature-sentance">NRIC (Pink / Blue) No</div>
            </div>
          </div>
          <div
            class="common_padding"
            style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
            "
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: center;
              "
            >
              <!-- <div>OCT 15, 1524</div> -->
              <div
                class="common_input-bg"
                style="
                  border-bottom: 1px solid black;
                  width: 290px;
                  height: 15px;
                "
              ></div>
              <div class="signature-sentance">Name of Local Contact</div>
            </div>
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: center;
              "
            >
              <!-- <div>OCT 15, 1524</div> -->
              <div
                class="common_input-bg"
                style="
                  border-bottom: 1px solid black;
                  width: 290px;
                  height: 15px;
                "
              ></div>
              <div class="signature-sentance">Contact Number</div>
            </div>
          </div>
          <div
            class="common_padding"
            style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
            "
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: center;
              "
            >
              <!-- <div>OCT 15, 1524</div> -->
              <div
                class="common_input-bg"
                style="
                  border-bottom: 1px solid black;
                  width: 290px;
                  height: 15px;
                "
              ></div>
              <div class="signature-sentance">Address of Local Contact</div>
            </div>
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: center;
              "
            >
              <!-- <div>OCT 15, 1524</div> -->
              <div
                class="common_input-bg"
                style="
                  border-bottom: 1px solid black;
                  width: 290px;
                  height: 15px;
                "
              ></div>
              <div class="signature-sentance">Email Address</div>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="common_padding" style="margin-bottom: 15px">
            <div style="border-bottom: black dashed 2px"></div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div
            class="common_padding"
            style="
              text-decoration: underline;
              font-weight: bold;
              margin-bottom: 15px;
            "
          >
            Only for application where Local Contact is an individual:
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div
            class="common_padding"
            style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
            "
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: center;
              "
            >
              <!-- <div>OCT 15, 1524</div> -->
              <div
                style="
                  border-bottom: 1px solid black;
                  width: 290px;
                  height: 15px;
                "
              ></div>
              <div class="signature-sentance">
                Signature of person acting on behalf<br />
                of the company/firm
              </div>
            </div>
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: center;
              "
            >
              <!-- <div>OCT 15, 1524</div> -->
              <div
                class="common_input-bg"
                style="
                  border-bottom: 1px solid black;
                  width: 290px;
                  height: 15px;
                "
              ></div>
              <div class="signature-sentance">
                Unique Entity Number (UEN) of <br />
                the company/firm
              </div>
            </div>
          </div>
          <div
            class="common_padding"
            style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
            "
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: center;
              "
            >
              <!-- <div>OCT 15, 1524</div> -->
              <div
                class="common_input-bg"
                style="
                  border-bottom: 1px solid black;
                  width: 290px;
                  height: 15px;
                "
              ></div>
              <div class="signature-sentance">Name, NRIC No. and Designation/Capacity</div>
            </div>
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: center;
              "
            >
              <!-- <div>OCT 15, 1524</div> -->
              <div
                class="common_input-bg"
                style="
                  border-bottom: 1px solid black;
                  width: 290px;
                  height: 15px;
                "
              ></div>
              <div class="signature-sentance">Contact Number</div>
            </div>
          </div>
          <div
            class="common_padding"
            style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
            "
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: center;
              "
            >
              <!-- <div>OCT 15, 1524</div> -->
              <div
                class="common_input-bg"
                style="
                  border-bottom: 1px solid black;
                  width: 290px;
                  height: 15px;
                "
              ></div>
              <div class="signature-sentance">Company Name and Address</div>
            </div>
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: center;
              "
            >
              <!-- <div>OCT 15, 1524</div> -->
              <div
                class="common_input-bg"
                style="
                  border-bottom: 1px solid black;
                  width: 290px;
                  height: 15px;
                "
              ></div>
              <div class="signature-sentance">Email Address</div>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div
            style="margin-bottom: 10px; margin-top: 10px"
            class="common_padding"
          >
            V39A
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>

    `;
};

export default visaFormTemplate;

