import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Ribhfunding } from "../target/types/ribhfunding";

describe("ribhfunding", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Ribhfunding as Program<Ribhfunding>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
