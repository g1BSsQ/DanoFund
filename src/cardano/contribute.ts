import {
  applyParamsToScript,
  BrowserWallet,
  deserializeAddress,
  mConStr0,
  serializePlutusScript,
  stringToHex,
} from "@meshsdk/core";

import {
  getTxBuilder,
  getWalletInfoForTx,
  readValidator,
} from "./adapter";

export async function contribute(
  //other: number,
  wallet: BrowserWallet,
  admin: string,
  assets: any,
  amount: number,
 // minimum: number,
  name: string,
//  contributeSelection: number,
  proposalEligibilityText: string,
  cooldownPeriod: number,
  visibility: string,
  minContribution: number,
  approvalThreshold: number,
  votingMechanism:string,


) {
  try {
    const { utxos, walletAddress } = await getWalletInfoForTx(
      wallet,
    );
    const pubkeyContributor = deserializeAddress(walletAddress).pubKeyHash;
    const pubkeyAdmin = deserializeAddress(admin).pubKeyHash;
    const contributeCompileCode = readValidator("contribute.contribute.spend");
    const constributeScriptCbor = applyParamsToScript(
      contributeCompileCode,
      [pubkeyAdmin, stringToHex(name),
        approvalThreshold,
        stringToHex(votingMechanism),
        stringToHex(proposalEligibilityText),
        minContribution,
        cooldownPeriod,
        stringToHex(visibility),

        
      ],
    );
    const scriptAddr = serializePlutusScript(
      { code: constributeScriptCbor, version: "V3" },
      undefined,
      0,
    ).address;
    const txBuilder = getTxBuilder();
    const datum = mConStr0([amount, pubkeyContributor, pubkeyAdmin]);

    await txBuilder
      .spendingPlutusScriptV3()
      .txOut(scriptAddr, assets)
      .txOutInlineDatumValue(datum)
      .changeAddress(walletAddress)
      .requiredSignerHash(pubkeyContributor)
      .selectUtxosFrom(utxos)
      .setNetwork("preview");


    const tx = await txBuilder.complete();
    const signedTx = await wallet.signTx(tx, true);
    const TxHash = await wallet.submitTx(signedTx);

    return TxHash;
  } catch (error) {
    throw new Error("Error in contribute function: " + error);
  }

}

