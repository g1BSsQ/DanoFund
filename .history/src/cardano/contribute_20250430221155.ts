import {
    applyParamsToScript,
    Asset,
    deserializeAddress,
    mConStr0,
    MeshTxBuilder,
    serializePlutusScript,
    stringToHex,
    BrowserWallet
  } from "@meshsdk/core";
  
  import {
    blockchainProvider,
    getWalletInfoForTx,
    readValidator,
    getTxBuilder
  } from "./adapter";
  
  export async function contribute(wallet: BrowserWallet, admin: string, assets: any, amount: number, minimum: number, name: string) {
    try {
      const { utxos, walletAddress} = await getWalletInfoForTx(
        wallet
      );
      const pubkeyContributor = deserializeAddress(walletAddress).pubKeyHash;
      const pubkeyAdmin = deserializeAddress(admin).pubKeyHash;
      const contributeCompileCode = readValidator("contribute.contribute.spend");
      const constributeScriptCbor = applyParamsToScript(
        contributeCompileCode,
        [pubkeyAdmin, stringToHex(name), minimum],
      );
      const scriptAddr = serializePlutusScript(
        { code: constributeScriptCbor, version: "V3" },
        undefined,
        0,
      ).address;
      const txBuilder = getTxBuilder();
      const datum = mConStr0([ amount, pubkeyContributor, pubkeyAdmin] );
      
      await txBuilder
      .spendingPlutusScriptV3()
      .txOut(scriptAddr, assets)
      .txOutInlineDatumValue(datum)
      .changeAddress(walletAddress)
      .requiredSignerHash(pubkeyContributor)
      .selectUtxosFrom(utxos)
      .setNetwork("preprod");
      
      const tx =  await txBuilder.complete();
      const signedTx = await wallet.signTx(tx, true);
      const TxHash = await wallet.submitTx(signedTx);
      
      return TxHash;
    } catch(error) {
      throw new Error("Error in contribute function: " + error);
    }
  }
  
  
  