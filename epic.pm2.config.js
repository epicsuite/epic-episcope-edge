/**
 * This is a PM2 configuration file.
 *
 * References:
 * - https://pm2.keymetrics.io/docs/usage/application-declaration/
 * - https://pm2.keymetrics.io/docs/usage/environment/
 */

module.exports = {
  apps: [
    {
      name: "appserver",
      script: "epicServer.js",
      instances: 4,
      exec_mode: "cluster",
      cwd: "./webapp/server",
      node_args: "--max_old_space_size=1024",
      max_memory_restart: "150M"
    },
    {
      name: "cronserver",
      script: "epicCronServer.js",
      cwd: "./webapp/server",
      node_args: "--max_old_space_size=1024",
      max_memory_restart: "150M"
    }
  ]
}