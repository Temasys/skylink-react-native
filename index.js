/**
 * This sets the imports that are required for bundling Skylink_RN
 */

import AdapterJS_RN from './dist/adapterjs_rn/adapterjs_rn';
import Skylink, { SkylinkConstants, SkylinkEventManager, SkylinkLogger } from 'skylinkjs';

Skylink.SkylinkConstants = SkylinkConstants;
Skylink.SkylinkEventManager = SkylinkEventManager;
Skylink.SkylinkLogger = SkylinkLogger;

module.exports = { Skylink };
