import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../home";


function RouterLink() {
    return (
        <Routes>
            <Route path="/nft-checker" element={<Navigate to="/nft-checker/all/all/all" />} />
             <Route path="/nft-checker/:chainIdstr/:nftadd/:id" element={<Home />} />

        </Routes>
    );
}

export default RouterLink;
