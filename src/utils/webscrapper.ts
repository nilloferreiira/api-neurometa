import puppeteer, { Page } from "puppeteer";

interface DoctorData {
  name: string;
  uf: string;
  crm: number;
  // adicionar o resto
}

async function fillData(page: Promise<Page>, doctorData: DoctorData) {
  try {
    // text inputs
    const nameInput = await (await page).waitForSelector('input[name="nome"]');
    if (nameInput) {
      await nameInput.focus();
      await (await page).keyboard.type(doctorData.name);
    } else {
      console.error('Input element with name="nome" not found.');
    }
    const crmInput = await (await page).waitForSelector('input[name="crm"]');
    if (crmInput) {
      await crmInput.focus();
      await (await page).keyboard.type(String(doctorData.crm));
    } else {
      console.error('Input element with name="crm" not found.');
    }

    // select inputs
    // UF
    await (await page).waitForNetworkIdle();

    if (await (await page).waitForSelector("#uf")) {
      console.log("uf found");
    }
    await (await page).select("select#uf", doctorData.uf);

    //por segurança, tenta marcar a uf de novo
    await (await page).waitForNetworkIdle();
    await (await page).select("select#uf", doctorData.uf);

    // subscription
    (await page).select("select#inscricao", "P");
    // situation type
    (await page).select("select#tipoSituacao", "A");
    // situation
    (await page).select("select#situacao", "A");
    // specialty
    // await (await page).select("[id='especialidade']", "95");

    // btn submit
    const btnSubmit = await (await page).waitForSelector("button.btn-buscar");
    await btnSubmit?.click();

    // get doctorInfo
    const doctorElement = await (
      await page
    ).waitForSelector(".resultado-item", { timeout: 5000 });

    const doctorInfo = await (
      await page
    ).evaluate((element) => {
      const name = element?.querySelector("h4")?.textContent;
      let situationElement;
      if (element !== null) {
        situationElement = Array.from(element.querySelectorAll(".col-md")).find(
          (el: any) => el.textContent?.includes("Regular")
        )
          ? "Regular"
          : "Not Regular";
      }

      return { name, situation: situationElement };
    }, doctorElement);

    // validate doctorInfo
    if (
      doctorInfo.situation === "Regular" &&
      doctorInfo.name === doctorData.name
    ) {
      return {
        name: doctorInfo.name,
        crm: doctorData.crm,
        uf: doctorData.uf,
        situation: doctorInfo.situation,
      };
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
  }
}

export async function webScrapper(doctarData: DoctorData) {
try {                                   // 
    const browser = await puppeteer.launch({ headless: false });
    const page = browser.newPage();
    const URL = "https://portal.cfm.org.br/busca-medicos/";

    // apagar esta linha
      (await page).setViewport({
        width: 1365,
        height: 965,
        deviceScaleFactor: 1,
      });
    //

    (await page).goto(URL);

    const isValidated = await fillData(page, doctarData);

    if (isValidated !== false) {
      if (isValidated === undefined) {
        throw new Error(
          `Falha ao obter os dados do site do CFM. Por favor tente novamente em alguns instantes!`
        );
      }
      return isValidated;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
  }
}