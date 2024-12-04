// components/GuaranteeContract.tsx
import React from 'react';



interface FormData {
    // Datos del contrato
    nombreOrganizacion: string;
    nameApplicant: string;
    dni: string;
    contractType: "Comercio" | "Vivienda" | null;
    cantQuotas: string;
    numQuota: number;
    cantCogarante: string;
    numContract: number;
    dateCurrent: string;
    // Datos Personales
    addressTenant: string;
    email: string;
    addressRent: string;
    warrantyAmount: string;
    percentageQuota: string;
    expirationMonth: string;
    cantMonths: string;
    amountOfRent: number;
    amountOfRentString: string;
    expense: number;
    expenseCurrency: string;
    dateSignature: string;
    currencyWarrantyAmount?: string;
    currencyAmountOfRent?: string;
};


const HousingQuotas: React.FC<FormData> = ({ nombreOrganizacion,
    nameApplicant,
    dni,
    contractType,
    cantQuotas,
    numQuota,
    cantCogarante,
    numContract,
    dateCurrent,
    addressTenant,
    email,
    addressRent,
    warrantyAmount,
    percentageQuota,
    expirationMonth,
    cantMonths,
    amountOfRent,
    amountOfRentString,
    expense,
    expenseCurrency,
    dateSignature,
    currencyWarrantyAmount,
    currencyAmountOfRent, }) => {
    let porcentageRest;
    //     function calPorcentage = ()=> {
    //     // calcular del 100 cual es el porcentaje que resta
    // }

    return (
        <div>
            <h1>Contrato Nro. {numContract}</h1>
            <h2>CONTRATO DE GARANTÍA PARA USO HABITACIONAL - ANEXO I – TÉRMINOS Y CONDICIONES</h2>
            <p>
                {nombreOrganizacion} como parte de GRUPO DELSUD ADMINISTRACIÓN FINANCIERA E INMOBILIARIA S.R.L., CUIT 30-71616529-5, representada por Francisco Alberto VILA BASUALDO, DNI 36.092.449.
                en su calidad de Socio Gerente cuyo mandato exhibe en este acto y declara que su personería se encuentra vigente,
                constituyendo domicilio especial en Calle 37 N°125 de la ciudad de La Plata,
                en adelante indistintamente el FIADOR o {nombreOrganizacion} y el solicitante {nameApplicant}, DNI nro. {dni}.,
                quien constituye domicilio especial en {addressTenant}, correo electrónico {email} en adelante el LOCATARIO,
                de común acuerdo establecen:
            </p>
            <p>
                1. Que los intervinientes, acuerdan que el presente contrato resulta accesorio e integrativo al de locación,
                respecto del inmueble sita en la calle {addressRent} localidad (en adelante el contrato de locación), y se incorpora como ANEXO I,
                a través del cual se accede al mismo y rige los derechos, deberes y la conducta a la que deben sujetarse.

            </p>
            <p>
                2. {nombreOrganizacion} se constituye frente al LOCADOR en FIADOR del LOCATARIO por las obligaciones que le resulten exigibles al mismo en virtud del contrato de locación suscripto y antes referido,
                con las limitaciones y alcance que dispone el presente contrato de garantía.
            </p>
            <p>
                3. Que el valor total de la garantía es de {currencyWarrantyAmount} {warrantyAmount} y el pago se establece en una primera cuota, equivalente al {percentageQuota}% del valor de la garantía en concepto de RESERVA y el saldo restante,
                dividido en 1 (uno) pago al contado equivalente al {porcentageRest}% restante que deberá ser abonado al momento de la firma de la garantía.
            </p>
            <p>
                4. La presente fianza accesoria tendrá vigencia a partir del momento de la suscripción del contrato de locación principal al que ella se anexa y su plazo de vigencia será,
                en principio, el de {cantQuotas} meses. En caso de que los plazos del contrato locativo no sean acordes a los estipulados en la presente fianza, {nombreOrganizacion}no asumirá responsabilidad, liberándose totalmente ante cualquier incumplimiento.
                Ante la falta de restitución del inmueble al vencimiento del plazo contractual convenido, continuará vigente la fianza, en tanto el LOCADOR y/o quien detente mandato suficiente notifique formal y fehacientemente de tal acontecimiento a {nombreOrganizacion},
                dentro de los TREINTA (30) días corridos de acaecida tal situación, y procediendo a extender mandato judicial suficiente en los términos del apartado B de la “cláusula especial de fianza” inserta en el contrato de locación,
                bajo pena de quedar extinta la presente garantía de pleno derecho y sin necesidad de interpelación previa, producto del vencimiento de su plazo.- No serán válidos u oponibles aquellos acuerdos que impongan al FIADOR novación,
                prórroga y/o modificación del contrato de locación que convengan LOCADOR y LOCATARIO sin su previa aceptación formal y expresada por escrito, ni le resultará oponible el otorgamiento de otros plazos para proceder a la devolución del inmueble locado,
                quedando excluida la responsabilidad del FIADOR frente a ello.
                Finalmente, se deja constancia que solo tendrá validez la presente fianza si la fecha de suscripción del contrato de locación, indicado en el punto 1, fuere celebrado dentro del plazo máximo de 30 días corridos de firmado el presente contrato de garantía.
                - {nombreOrganizacion} deja expresamente manifiesto que en caso de que el contrato de locación no se firme en el plazo señalado por razones que no le sean imputables, el LOCATARIO no tendrá derecho a devolución y/o reclamo alguno por los importes abonados en concepto de anticipo y/o reserva de contrato,
                los cuales quedarán a favor de {nombreOrganizacion}. Por otro lado, si la modalidad de pago elegida fue en cuotas, deberá abonar la totalidad de las mismas. Asimismo, será requisito esencial que dicho contrato de locación contenga la cláusula especial de fianza, cuyo contenido se procede a redactar para su ulterior transcripción al mismo:

                <span>
                    “A) {nombreOrganizacion} como parte de GRUPO DELSUD ADMINISTRACIÓN   FINANCIERA E INMOBILIARIA S.R.L., CUIT 30-71616529-5, constituyendo domicilio Calle 37 N°125 de la ciudad de La Plata, donde serán válidas todas las notificaciones que se le remitan y en los términos del CONTRATO DE GARANTÍA N° {numContract}- ANEXO I – TÉRMINOS Y CONDICIONES,
                    al único efecto de asumir la calidad de FIADOR subsidiario del LOCATARIO, renunciando desde ya a exigir el cumplimiento previo del obligado principal.- Ello, en un todo de acuerdo con el contrato de garantía que integra este contrato de locación y se incorpora como ANEXO I al presente y que todos los intervinientes declaran conocer y aceptar en todos sus términos.
                    - La presente Fianza es un contrato accesorio que comenzará a regir a partir de la fecha en que se suscribe el presente contrato de locación y que será válida hasta la efectiva restitución del inmueble locado ante quien detente derecho suficiente.- Los contratantes, para un efectivo cumplimiento de la garantía, se someten a los siguientes procedimientos y plazos perentorios:
                    A.1) El LOCADOR, previa intimación fehaciente por mora  al LOCATARIO, deberá notificar vía correo electrónico los incumplimientos al FIADOR {nombreOrganizacion}, dentro de los 30 días corridos de acontecido cada vencimiento de pago respecto del Alquiler y Expensas Ordinarias bajo pena de imputarse la caducidad de la garantía frente a cada reclamo de periodo extemporáneo.
                    - Ante el segundo aviso consecutivo de incumplimiento de pago de canon locativo por parte del LOCATARIO, es que el LOCADOR deberá rescindir unilateralmente el contrato locativo y extender el mandato previsto en los términos del apartado. B) de la presente cláusula, siendo ello condición esencial, bajo pena de quedar extinta la Fianza de pleno derecho, liberando totalmente al FIADOR.
                    Por su parte, {nombreOrganizacion} se obliga a pagar y poner a disposición del LOCADOR las sumas y rubros que este le reclamase, dentro de los plazos de exigibilidad y en los términos de la garantía, en el lapso de DIEZ (10) días hábiles contados desde la notificación por el requerimiento de mora del LOCATARIO.- Cumplimentado lo expuesto, {nombreOrganizacion} queda obligada a poner a disposición del LOCADOR,
                    o las personas que lo representen legal y/o fehacientemente, los importes dinerarios que correspondan a los eventuales incumplimientos del LOCATARIO dentro de los límites taxativos antes mencionados.- Por los pagos emitidos por el FIADOR, el LOCADOR cede las acciones tendientes a promover proceso de ejecución por la vía ejecutiva contra el LOCATARIO, sus sucesores, causahabientes y/u otras garantías otorgadas al mismo a su arbitrio con todos aquellos intereses,
                    gastos y conceptos que resulten aplicables.-Se deja pautado que son de carácter personal las obligaciones de pago asumidas por el LOCATARIO y que surgen del presente contrato.- En efecto, la falta de cumplimiento por parte del LOCATARIO, hace nacer el derecho del LOCADOR a rescindir el contrato y reclamar el desalojo del inmueble, sin que tal derecho se torne limitado, impedido o subsanado por los pagos realizados por la Fianza, dado que tales pagos no purgan la morosidad del LOCATARIO.

                </span>
                <span>
                    B) En los supuestos del punto A.1) de la presente cláusula y, frente al incumplimiento de pago del segundo canon locativo consecutivo por parte del LOCATARIO, es que el LOCADOR se obliga a notificar de ello, en forma directa y fehaciente a {nombreOrganizacion} dentro de los plazos allí enunciados y de acaecida la mora automática, a fin de que el FIADOR subsidiariamente abone los importes en los términos de la garantía.
                    El mencionado desembolso correspondiente al segundo canon locativo quedará sujeto a que previamente y dentro del plazo de TREINTA (30) días corridos, el LOCADOR  haya intimado el pago correspondiente, y sin haber tenido respuesta positiva hubiere procedido a rescindir el contrato locativo y confiera mandato judicial en favor de los letrados de {nombreOrganizacion}.
                    - Dichas situaciones se establecen como condición esencial para la vigencia de la FIANZA, bajo pena de extinción de la presente garantía, de pleno derecho y sin necesidad de interpretación previa.- El poder judicial que conferirá el LOCADOR será destinado a los profesionales letrados que {nombreOrganizacion} indique, pudiendo el LOCADOR unificar su representación legal.
                    - El mandato será especial, con facultades suficientes tendientes a conseguir un eventual desahucio judicial que permita la desocupación del inmueble en caso de falta de pago y/o vencimiento de contrato, como asimismo arbitrar los medios necesarios para la restitución de propiedad y perseguir el pago de las sumas adeudadas.
                    - En tal exclusivo caso, los costos y las costas de la representación profesional legal, como los gastos, sean judiciales o extrajudiciales, serán a cargo del FIADOR, quien los repetirá por su propio derecho al LOCATARIO y/o sus co-garantes.- El mandato que ha de otorgar el LOCADOR contendrá, también, la facultad de representación para enviar todo tipo de misivas,
                    intimaciones y requerimientos.- Una vez afianzadas las sumas parte de {nombreOrganizacion} al LOCADOR, los derechos de este se encontrarán automáticamente cedidos quedando el FIADOR en la misma situación jurídica frente al LOCATARIO que el LOCADOR, pudiendo ejercer todas y cada una de las acciones y derechos que el LOCADOR detenta y surgen del contrato de locación.
                    - LOCADOR y LOCATARIO autorizan y dan expresa conformidad, sin que ello implique modificación alguna a lo establecido en el contrato de locación suscripto por las partes, al otorgamiento del mandato aludido siendo las facultades descriptas meramente enunciativas.- Para el caso en que el FIADOR inminentemente deba abrir la instancia judicial contra el LOCATARIO,
                    y que el correspondiente traslado de demanda esté suspendido y/o supeditado al cumplimiento previo de requisitos, cargas y recaudos en cabeza del locador atento normativa vigente, los pagos por afianzamiento en favor de este se verán interrumpidos hasta tanto el locador regularice lo mencionado, y se verán reanudados sin retroactividad una vez subsanada la obligación pendiente.
                    - Queda expresamente establecido que la fianza comprenderá su obligación respecto del rubro alquiler, tanto del/los canon/es estipulado/s taxativamente en el presente contrato, como de aquellos que resultare por aplicación de los índices previstos en la normativa vigente, ilimitada e íntegramente, siempre que corresponda según su destino locativo.
                    - Si durante el curso del plazo del contrato de locación garantido las partes decidieron modificar el valor inicial del alquiler preestablecido y sobre el cual se aplicarán los ajustes, ello deberá notificarse previamente al FIADOR de modo fehaciente, quien tendrá derechos a aceptar tal modificación repactando su acuerdo con el LOCATARIO debiendo este afrontar el mayor costo que tal modificación implica,
                    o en el caso de rechazar la misma manteniendo solo la extensión de su Fianza en su garantía original.- Queda establecido que el silencio del FIADOR ante cualquier modificación del acuerdo original celebrado entre las partes no podrá ser considerado aceptación expresa ni implícita de lo acordado, y por lo tanto, conformidad con el aumento o extensión de la fianza original oportunamente suscripta.
                    - Los intervinientes en el presente contrato establecen que los domicilios que indican son domicilios especiales , donde se tendrán por válidas, y surtirán plenos efectos legales, aun cuando las partes no se encuentren o no utilicen de manera permanente los mismos, y se someten a la jurisdicción y competencia de los tribunales civiles y comerciales del Departamento Judicial de La Plata, con expresa renuncia a cualquier otro fuero y/o jurisdicción que pudiere corresponderles.
                    - Los domicilios especiales aquí indicados podrán ser modificados previa notificación fehaciente a todas las partes, revistiendo siempre los nuevos también la calidad de domicilios especiales con los efectos antes descritos.- Ninguna disposición del contrato de locación vinculada a la Fianza puede contrariar la presente cláusula y las contenidas en el Anexo I del presente, bajo pena de nulidad absoluta.”
                    Ante un posible incumplimiento a lo mencionado en el párrafo anterior quedará sin efecto dicha Fianza y, en caso de haberse recepcionado posteriormente -y por cualquier motivo- importe alguno vinculado a la extensión de la presente garantía, ello quedará sin efecto, debiendo reembolsarse los importes recepcionados.

                </span>
            </p>
            <p>
                5. Queda expresamente establecido que la Fianza comprende exclusivamente:
                El pago mensual de los alquileres pactados en el Contrato de Locación,
                siendo el monto inicial de {currencyAmountOfRent} {amountOfRent} (PESOS {amountOfRentString}), y las actualizaciones que se dispongan de acuerdo a dicho Contrato.
                <span>
                    5.1 El pago de las expensas ordinarias mensuales desde la celebración del contrato de locación hasta la restitución del inmueble locado.
                    - El importe inicial de las expensas ordinarias del presente contrato registra la suma mensual de {expenseCurrency} {expense}.
                    - Esta obligación podrá ser reclamada sólo en caso de que hubiere sido asumida por el LOCATARIO en el contrato de locación.
                </span>
            </p>
            <p>
                Conforme lo anterior se deja establecido que las restantes obligaciones <strong>SE ENCUENTRAN EXCLUIDAS</strong> de la presente Fianza.
                - Los conceptos excluidos que se enumeran a continuación son citados a modo ejemplificativo y no taxativo:
                <span>
                    6.1 Las cláusulas penales, intereses y multas establecidas en el contrato de locación y/o la normativa vigente, con excepción de lo acordado en los puntos 5.2, 5.3, 5.4 y 5.5 precedentes.
                </span>
                <span>
                    6.2 Las expensas extraordinarias y sus intereses de cualquier naturaleza con independencia de quien las hubiere asumido en el contrato de locación.
                </span>
                <span>
                    6.3 Los daños y/o perjuicios y/o reparaciones que pudieren provocarse por hechos de caso fortuito y/o fuerza mayor y/o por los causados por la conducta del LOCATARIO y/o terceros, sean respecto del inmueble locado y/u otros bienes o personas, a excepción de lo señalado en el punto 5.3.
                </span>
                <span>
                    6.4 Los daños y/o deterioro y/o reparaciones necesarias del inmueble locado causado por el transcurso del tiempo, el uso o desgaste natural de las cosas.
                </span>
                <span>
                    6.5 Los impuestos, tasas y contribuciones nacionales, provinciales y municipales que afecten al inmueble locado y/o el pago de servicios sobre el mismo, como así tampoco los impuestos necesarios para la habilitación municipal a excepción de los señalados en el punto 5.2.

                </span>
                <span>
                    6.6 Los gastos, tasas y/o honorarios profesionales judiciales y/o extrajudiciales que fueren instados por el LOCADOR, el LOCATARIO y/o cualquier tercero que no sea {nombreOrganizacion}.
                </span>
                <span>
                    6.7 El pago de la tasa municipal SUM (Servicios Urbanos Municipales) y los servicios de agua corriente y/o electricidad, sus recargos y multas, cuyos importes están expresados por las facturas y/o informes de deuda, emitidos por las empresas prestadoras de los mismos, que correspondan al inmueble locado, hasta un monto máximo equivalente a (2) meses de alquiler. - Esta obligación podrá ser reclamada sólo en el caso que tal obligación hubiere sido asumida por el LOCATARIO en el contrato de locación.
                </span>
                <span>
                    6.8 El pago de las penalidades que se establezcan por daños y/o roturas causados, por exclusiva responsabilidad del inquilino, en vidrios, cerraduras, grifería, calefactores y/o artefactos de aire acondicionado hasta un monto máximo equivalente a dos (2) meses de alquiler.- Esto podrá ser reclamado sólo en el caso que tal obligación hubiere sido asumida por el LOCATARIO en el contrato de locación y se haya notificado a {nombreOrganizacion} dentro de los 10 días posteriores a la finalización del contrato de locación y consecuente devolución de llaves.
                </span>
                <span>
                    6.9 El pago de los gastos que ocasionen y/o demanden, tanto judicial como extrajudicialmente, el eventual desalojo y/o desocupación del inmueble.
                </span>
            </p>
            <p>
                7. El LOCADOR asume la obligación de notificar a {nombreOrganizacion}, por escrito y de modo fehaciente, de cualquier incumplimiento en que incurra el LOCATARIO que pueda comprometer la garantía de Fianza otorgada,
                en los términos del presente contrato.- Tales notificaciones deberán realizarse dentro de los TREINTA (30) días corridos del plazo de cada vencimiento de pago del alquiler y/o expensas ordinarias y
                de los SESENTA (60) días corridos del plazo de cada vencimiento de los restantes rubros objeto de la Fianza, de corresponder, bajo pena de imputarse la caducidad de la garantía frente a cada reclamo de periodo extemporáneo.
                - Tales obligaciones son esenciales y previas a todo reclamo de pago que se dirija contra el FIADOR por las obligaciones afianzadas y debe realizarse ante cada uno de los presuntos incumplimientos.
                <span>
                    7.1 Ocurrido lo previsto en el punto anterior, {nombreOrganizacion} pondrá a disposición del LOCADOR el importe adeudado en el término de DIEZ (10) días hábiles de recepcionado el requerimiento, por cuanto derecho correspondiere, quedando autorizado posteriormente {nombreOrganizacion} por su propio derecho, a intimar y/o promover demanda por la vía ejecutiva y/o exigir otras garantías otorgadas por el LOCATARIO a su total arbitrio, como los saldos de precio no abonados, considerándose todas las obligaciones como de plazo vencido.
                </span>
            </p>
            <p>
                8. TRUST FUND está obligado a abonar las obligaciones imputables al LOCATARIO que ha garantizado en favor del LOCADOR y que se encuentren incumplidas, de plazo vencido,
                con las limitaciones y alcances del presente contrato de Fianza.
            </p>
            <p>
                9. El LOCATARIO declara y garantiza que cuenta con los fondos y recursos económicos suficientes para atender las obligaciones derivadas del contrato de locación suscripto y el presente contrato de Fianza.
            </p>
            <p>
                10. El LOCATARIO se obliga a dar aviso e información detallada a TRUST FUND, en el plazo de 48hs., de cualquier circunstancia, hecho o conflicto con el LOCADOR o terceros que pueda comprometer la Fianza otorgada.
                En caso de reclamo o intimación judicial o extrajudicial por incumplimiento de obligaciones contractuales referidas al inmueble, sea proveniente del LOCADOR o terceros,
                el LOCATARIO se encuentra obligado a asumir su defensa diligentemente oponiendo todas las defensas a las que tuviere derecho, brindando información detallada y copia documentada de ello a TRUST FUND.

            </p>
            <p>
                11. Queda expresamente establecido entre las partes que aun cuando el LOCATARIO cuestione su responsabilidad por incumplimientos contractuales alegados por el LOCADOR, en la hipótesis de reclamo del mismo contra TRUST FUND,
                éste último podrá efectuar los pagos garantizados sin considerar las defensas alegadas.
            </p>
            <p>
                12. Las partes de común acuerdo establecen y declaran que las obligaciones, contenidas en el contrato principal de locación de inmueble, son de carácter personal del LOCATARIO,
                circunstancia por la cual los pagos que haga TRUST FUND en virtud de la garantía otorgada en favor del LOCADOR no purga la mora del primero,
                dejando incólume el derecho del LOCADOR y/o su cesionario y/o TRUST FUND a declarar rescindido el contrato de locación y a solicitar la inmediata desocupación del inmueble,
                el que deberá ser restituido libre de ocupantes y/o de cosas ajenas.
            </p>
            <p>
                13. La rescisión o resolución anticipada del contrato de locación principal, por cualquier causa que fuere, no otorga derecho alguno a reclamar la restitución de parte proporcional del precio pagado o a pagar por la fianza otorgada, siendo tal precio definitivo y no reembolsable, insusceptible de disminución o restitución.
            </p>
            <p>
                14. La Fianza otorgada se extingue conjuntamente con el contrato de locación principal y/o si se declare la nulidad de éste y/o si existiere simulación en la celebración del mismo y/o si el LOCADOR no tuviere poder o mandato suficiente de administración del inmueble.
            </p>
            <p>
                15. Si se verificase que la información presentada por el LOCATARIO y/o sus garantes respecto de sus actividades, bienes, datos personales o remuneraciones fuere falsa o inexacta, TRUST FUND tiene derecho a solicitar las sustituciones y/o ampliaciones que considere necesarias,
                sin perjuicio de quedar habilitado a requerir de las medidas cautelares que garanticen su crédito y amparen sus responsabilidades.
            </p>
            <p>
                16. Los impuestos y tasas derivados del presente contrato serán pagados en exclusividad por el LOCATARIO afianzado.
            </p>
            <p>
                17. Las partes, de común acuerdo, manifiestan que, en caso de controversia o conflicto por el alcance o la interpretación de las estipulaciones del presente contrato, se someten a la jurisdicción de los Tribunales Ordinarios Civiles y Comerciales del Departamento Judicial de La Plata, Pcia. de Buenos Aires, renunciando a cualquier otro fuero y/o jurisdicción que les pudiere corresponder.
            </p>

            <div>
                <p><strong>NOTIFICACIONES.</strong> Las partes constituyen los siguientes datos de contacto donde</p>
            </div>
            <div>
                <p>deberán cursarse toda y cualquier comunicación que deba practicarse conforme a este instrumento, incluyendo notificaciones físicas y/o electrónicas.</p>
                <p>EL FIADOR:  Domicilio: Calle 37 125 La Plata, Bs. As.   Mail: info@trustfund.com.ar</p>
                <p>
                    EL INQUILINO / LOCATARIO:
                    Domicilio:
                    Mail:
                    Teléfono:
                </p>
            </div>
            <p>En prueba de conformidad, se firman tres (3) ejemplares de un mismo tenor y a un único efecto, en la ciudad de La Plata a los xx días de xx de 20xx. {dateSignature}</p>
        </div>
    );
};

export default HousingQuotas;
//cambiar mail corporativo