/*

    Copyright 2019 The Hydro Protocol Foundation

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

*/

pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;

import "./funding/Assets.sol";
import "./funding/CollateralAccounts.sol";
import "./GlobalStore.sol";

/**
 * External Functions
 */
contract ExternalFunctions is GlobalStore {

    //////////////////////
    // Assets Functions //
    //////////////////////

    function getAllAssetsCount()
        internal
        view returns (uint256)
    {
        return Assets.getAllAssetsCount(state);
    }

    //////////////////////////////////
    // Collateral Account Functions //
    //////////////////////////////////

    function liquidateCollateralAccounts(uint256[] calldata accountIDs) external {
        CollateralAccounts.liquidateCollateralAccounts(state, accountIDs);
    }

    function liquidateCollateralAccount(uint256 accountID) external {
        CollateralAccounts.liquidateCollateralAccount(state, accountID);
    }

    function isCollateralAccountLiquidable(
        uint256 accountID
    ) external view {
        CollateralAccounts.isCollateralAccountLiquidable(state, accountID);
    }
}