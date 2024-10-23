"use client";

import { CustomTooltipWrapper } from "../../basicos/CustomTooltipWrapper";
import { HorarioNoServidor } from "./HorarioNoServidor";

const INTERVALO_DE_ATUALIZACAO = 30 * 1000;

export function HorarioNoServidorSidebarAdministrativa() {
  return (
    <CustomTooltipWrapper
      elementoTrigger={
        <div>
          <p>Horário no sevidor: </p>
          <HorarioNoServidor
            intervalo_de_atualizacao={INTERVALO_DE_ATUALIZACAO}
          />
        </div>
      }
      elementoContent={`O sistema funciona com base neste horário. Este horário é atualizado automaticamente a cada ${INTERVALO_DE_ATUALIZACAO / 1000} segundos. Não é necessário atualizar a página.`}
    />
  );
}
