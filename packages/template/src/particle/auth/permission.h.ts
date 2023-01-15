import { particle } from "@euglena/core";

export type Permission = particle.Particle<
    "Permission",
    {
        /**
         * Allowed particles to receive
         * Fill with particle examples 
         * @example
         * {
         *  meta: {
         *      class: "Authenticate"
         *  }, data:{
         *       
         *  }
         * }
         */
        particles: particle.Particle[];
        sender:
            | {
                  /**
                   * Role name
                   * Should be unique in the whole database, across the applications
                   * @example
                   * AuthAdmin
                   */
                  role: string;
              }
            | { euglenaName: string }
            | "*";
        receiverEuglenaName: string;
    }
>;