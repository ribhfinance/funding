use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod ribhfunding {
    use super::*;

    pub fn create(ctx: Context<Create>, name: String, description: String) -> ProgramResult {
        let liquidity_pool = &mut ctx.accounts.liquidity_pool;
        liquidity_pool.name = name;
        liquidity_pool.description = description;
        liquidity_pool.amount_donated = 0;
        liquidity_pool.admin = *ctx.accounts.user.key;
        Ok(())
    }

    pub fn paiement(ctx: Context<Paiement>, amount: u64) -> ProgramResult {
        let liquidity_pool = &mut ctx.accounts.liquidity_pool;
        let user = &mut ctx.accounts.user;

        if liquidity_pool.admin != *user.key {
            return Err(ProgramError::IncorrectProgramId);
        }

        let rent_balance = Rent::get()?.minimum_balance(liquidity_pool.to_account_info().data_len());
        if **liquidity_pool.to_account_info().lamports.borrow() - rent_balance < amount {
            return Err(ProgramError::InsufficientFunds);
        }

        **liquidity_pool.to_account_info().try_borrow_mut_lamports()? -= amount;
        **user.to_account_info().try_borrow_mut_lamports()? += amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Paiement<'info> {
    #[account(mut)]
    pub liquidity_pool: Account<'info, LiquidityPool>,
    
    #[account(mut)]
    pub user: Signer<'info, >,
}

#[derive(Accounts)]
pub struct Create<'info> {
    
    #[account(init, payer=user, space=9000, seeds=[b"CAMPAIN_DEMO".as_ref(), user.key().as_ref()], bump)] 
    pub liquidity_pool: Account<'info, LiquidityPool>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}   

#[account]
pub struct LiquidityPool {
    pub name: String,
    pub description: String,
    pub amount_donated: u64,
    pub admin: Pubkey,
}