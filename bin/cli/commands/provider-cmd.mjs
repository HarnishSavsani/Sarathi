export function registerProvider(program) {
  program
    .command("provider [subcommand]")
    .description("Manage provider connections (use 'providers' for the full interface)")
    .allowUnknownOption()
    .allowExcessArguments()
    .action(() => {
      console.log(`
  Use \`sarathi providers\` for the full provider management interface:

    sarathi providers available   — show provider catalog
    sarathi providers list        — list configured connections
    sarathi providers test <name> — test a provider connection
    sarathi providers test-all    — test all active connections
    sarathi providers validate    — validate local configuration
`);
    });
}
