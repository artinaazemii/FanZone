import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";

const CATEGORIES = [
  { key: "home", label: "Home Kit" },
  { key: "away", label: "Away Kit" },
  { key: "third", label: "Third Kit" },
  { key: "goalkeeper", label: "Goalkeeper Kit" },
];



const productsData = {
  Barcelona: [
    {
      id: "1",
      name: "Home Jersey 2024",
      category: "home",
      description: "Classic blaugrana design with modern lightweight fabric.",
      price: 89,
      coinPrice: 80,
      coinAmount: 70,
      image: {
        uri: "https://store.fcbarcelona.com/cdn/shop/files/25100SMC_1.jpg?v=1738325326&width=990",
      },
    },
    {
      id: "2",
      name: "Home Jersey Shorts",
      category: "home",
      description: "Classic blaugrana design with modern lightweight fabric.",
      price: 89,
      coinPrice: 80,
      coinAmount: 70,
      image: {
        uri: "https://store.fcbarcelona.com/cdn/shop/files/FZ4691-410_1.jpg?v=1720003702&width=990",
      },
    },
    {
      id: "3",
      name: "Away Jersey 2024",
      category: "away",
      description: "Minimalist black with gold crest for away matches.",
      price: 84,
      coinPrice: 75,
      coinAmount: 65,
      image: {
        uri: "https://store.fcbarcelona.com/cdn/shop/files/25200C_1_88fba747-c277-4eab-8296-7a9b78b7d4b8.jpg?v=1744104847&width=990",
      },
    },
    {
      id: "4",
      name: "Away Jersey Shorts",
      category: "away",
      description: "Minimalist black with gold crest for away matches.",
      price: 84,
      coinPrice: 75,
      coinAmount: 65,
      image: {
        uri: "https://store.fcbarcelona.com/cdn/shop/files/FZ4690-010_1.jpg?v=1724850016&width=990https://store.fcbarcelona.com/cdn/shop/files/25200C_1_88fba747-c277-4eab-8296-7a9b78b7d4b8.jpg?v=1744104847&width=990",
      },
    },
    {
      id: "5",
      name: "Third Jersey",
      category: "third",
      description: "Alternative kit with bold design and crest.",
      price: 87,
      coinPrice: 77,
      coinAmount: 66,
      image: {
        uri: "https://store.fcbarcelona.com/cdn/shop/files/25300C_1_e1d07bd0-4599-45a4-bd70-164e97da04cb.jpg?v=1726551594&width=990",
      },
    },
    {
      id: "6",
      name: "Goalkeeper Jersey Shorts",
      category: "",
      description: "Breathable green goalkeeper shirt with mesh inserts.",
      price: 79,
      coinPrice: 70,
      coinAmount: 60,
      image: {
        uri: "https://store.fcbarcelona.com/cdn/shop/files/FQ2043-701_1.jpg?v=1726131182&width=990",
      },
    },
    {
      id: "7",
      name: "Goalkeeper Jersey Green",
      category: "goalkeeper",
      description: "Breathable green goalkeeper shirt with mesh inserts.",
      price: 79,
      coinPrice: 70,
      coinAmount: 60,
      image: {
        uri: "https://store.fcbarcelona.com/cdn/shop/files/FN9161-332_1.jpg?v=1742292109&width=990",
      },
    },
    {
      id: "8",
      name: "Goalkeeper Jersey Shorts",
      category: "goalkeeper",
      description: "Breathable green goalkeeper shirt with mesh inserts.",
      price: 79,
      coinPrice: 70,
      coinAmount: 60,
      image: {
        uri: "https://store.fcbarcelona.com/cdn/shop/files/FN8860-329_1.jpg?v=1721130255&width=990",
      },
    },
  ],

  "Real Madrid": [
    { id: "1", name: "Home Jersey", category: "home", description: "White kit with gold details.", price: 90, coinPrice: 82, coinAmount: 70, image: { uri: "https://shop.realmadrid.com/_next/image?url=https%3A%2F%2Flegends.broadleafcloud.com%2Fapi%2Fasset%2Fcontent%2Frmcfmz0196-01.jpg%3FcontextRequest%3D%257B%2522forceCatalogForFetch%2522%3Afalse%2C%2522forceFilterByCatalogIncludeInheritance%2522%3Afalse%2C%2522forceFilterByCatalogExcludeInheritance%2522%3Afalse%2C%2522applicationId%2522%3A%252201H4RD9NXMKQBQ1WVKM1181VD8%2522%2C%2522tenantId%2522%3A%2522REAL_MADRID%2522%257D&w=3840&q=75" } },
    { id: "2", name: "Home Jersey Shorts", category: "home", description: "Authentic match fit with advanced fabric.", price: 105, coinPrice: 94, coinAmount: 80, image: { uri: "https://shop.realmadrid.com/_next/image?url=https%3A%2F%2Flegends.broadleafcloud.com%2Fapi%2Fasset%2Fcontent%2FRMCFMP0202_01.jpg%3FcontextRequest%3D%257B%2522forceCatalogForFetch%2522%3Afalse%2C%2522forceFilterByCatalogIncludeInheritance%2522%3Afalse%2C%2522forceFilterByCatalogExcludeInheritance%2522%3Afalse%2C%2522applicationId%2522%3A%252201H4RD9NXMKQBQ1WVKM1181VD8%2522%2C%2522tenantId%2522%3A%2522REAL_MADRID%2522%257D&w=3840&q=75" } },
    { id: "3", name: "Away Jersey", category: "away", description: "Orange away kit for 2024/2025 season.", price: 85, coinPrice: 77, coinAmount: 65, image: { uri: "https://shop.realmadrid.com/_next/image?url=https%3A%2F%2Flegends.broadleafcloud.com%2Fapi%2Fasset%2Fcontent%2FRMCFMZ0201-1.jpg%3FcontextRequest%3D%257B%2522forceCatalogForFetch%2522%3Afalse%2C%2522forceFilterByCatalogIncludeInheritance%2522%3Afalse%2C%2522forceFilterByCatalogExcludeInheritance%2522%3Afalse%2C%2522applicationId%2522%3A%252201H4RD9NXMKQBQ1WVKM1181VD8%2522%2C%2522tenantId%2522%3A%2522REAL_MADRID%2522%257D&w=3840&q=75" } },
    { id: "4", name: "Away Jersey Shorts", category: "away", description: "Orange away match shirt.", price: 100, coinPrice: 90, coinAmount: 76, image: { uri: "https://shop.realmadrid.com/_next/image?url=https%3A%2F%2Flegends.broadleafcloud.com%2Fapi%2Fasset%2Fcontent%2FRMCFMP0215-1.jpg%3FcontextRequest%3D%257B%2522forceCatalogForFetch%2522%3Afalse%2C%2522forceFilterByCatalogIncludeInheritance%2522%3Afalse%2C%2522forceFilterByCatalogExcludeInheritance%2522%3Afalse%2C%2522applicationId%2522%3A%252201H4RD9NXMKQBQ1WVKM1181VD8%2522%2C%2522tenantId%2522%3A%2522REAL_MADRID%2522%257D&w=3840&q=75" } },
    { id: "5", name: "Third Jersey", category: "third", description: "Dark grey third shirt.", price: 88, coinPrice: 80, coinAmount: 68, image: { uri: "https://shop.realmadrid.com/_next/image?url=https%3A%2F%2Flegends.broadleafcloud.com%2Fapi%2Fasset%2Fcontent%2FRMCFMZ0204-01%25201%25201.jpg%3FcontextRequest%3D%257B%2522forceCatalogForFetch%2522%3Afalse%2C%2522forceFilterByCatalogIncludeInheritance%2522%3Afalse%2C%2522forceFilterByCatalogExcludeInheritance%2522%3Afalse%2C%2522applicationId%2522%3A%252201H4RD9NXMKQBQ1WVKM1181VD8%2522%2C%2522tenantId%2522%3A%2522REAL_MADRID%2522%257D&w=3840&q=75" } },
    { id: "6", name: "Third Jersey Shorts", category: "third", description: "Match edition with stretch fit.", price: 103, coinPrice: 92, coinAmount: 78, image: { uri: "https://shop.realmadrid.com/_next/image?url=https%3A%2F%2Flegends.broadleafcloud.com%2Fapi%2Fasset%2Fcontent%2FRMCFMP0224-01.jpg%3FcontextRequest%3D%257B%2522forceCatalogForFetch%2522%3Afalse%2C%2522forceFilterByCatalogIncludeInheritance%2522%3Afalse%2C%2522forceFilterByCatalogExcludeInheritance%2522%3Afalse%2C%2522applicationId%2522%3A%252201H4RD9NXMKQBQ1WVKM1181VD8%2522%2C%2522tenantId%2522%3A%2522REAL_MADRID%2522%257D&w=3840&q=75" } },
    { id: "7", name: "Goalkeeper Jersey", category: "goalkeeper", description: "Yellow goalkeeper shirt.", price: 78, coinPrice: 70, coinAmount: 58, image: { uri: "https://shop.realmadrid.com/_next/image?url=https%3A%2F%2Flegends.broadleafcloud.com%2Fapi%2Fasset%2Fcontent%2FRMCFMZ0206-01-1.jpg%3FcontextRequest%3D%257B%2522forceCatalogForFetch%2522%3Afalse%2C%2522forceFilterByCatalogIncludeInheritance%2522%3Afalse%2C%2522forceFilterByCatalogExcludeInheritance%2522%3Afalse%2C%2522applicationId%2522%3A%252201H4RD9NXMKQBQ1WVKM1181VD8%2522%2C%2522tenantId%2522%3A%2522REAL_MADRID%2522%257D&w=3840&q=75" } },
    { id: "8", name: "Goalkeeper Match Shorts", category: "goalkeeper", description: "Yellow version of GK Kit.", price: 96, coinPrice: 86, coinAmount: 72, image: { uri: "https://shop.realmadrid.com/_next/image?url=https%3A%2F%2Flegends.broadleafcloud.com%2Fapi%2Fasset%2Fcontent%2FRMCFMZ0206-04-1.jpg%3FcontextRequest%3D%257B%2522forceCatalogForFetch%2522%3Afalse%2C%2522forceFilterByCatalogIncludeInheritance%2522%3Afalse%2C%2522forceFilterByCatalogExcludeInheritance%2522%3Afalse%2C%2522applicationId%2522%3A%252201H4RD9NXMKQBQ1WVKM1181VD8%2522%2C%2522tenantId%2522%3A%2522REAL_MADRID%2522%257D&w=1080&q=75" } },
  ],

  "Arsenal": [
    { id: "1", name: "Home Jersey", category: "home", description: "Red with white sleeves classic.", price: 89, coinPrice: 80, coinAmount: 70, image: { uri: "https://i1.adis.ws/i/ArsenalDirect/mit6140_f?$pdpMainZoomImage$" } },
    { id: "2", name: "Home Match Shorts", category: "home", description: "Slim fit with performance fabric.", price: 104, coinPrice: 94, coinAmount: 81, image: { uri: "https://i1.adis.ws/i/ArsenalDirect/jis8136_f1?$pdpMainZoomImage$" } },
    { id: "3", name: "Away Jersey", category: "away", description: "Black away shirt with navy trims.", price: 85, coinPrice: 75, coinAmount: 65, image: { uri: "https://i1.adis.ws/i/ArsenalDirect/mit6147_f?$pdpMainZoomImage$" } },
    { id: "4", name: "Away Match Shorts", category: "away", description: "Athletic away kit match version.", price: 98, coinPrice: 87, coinAmount: 74, image: { uri: "https://i1.adis.ws/i/ArsenalDirect/jis8123_f?$pdpMainImage$" } },
    { id: "5", name: "Third Jersey", category: "third", description: "Purple shirt with gold badge.", price: 88, coinPrice: 79, coinAmount: 68, image: { uri: "https://i1.adis.ws/i/ArsenalDirect/miz0112_f?$pdpMainZoomImage$" } },
    { id: "6", name: "Third Match Shorts", category: "third", description: "Match fit black third jersey.", price: 102, coinPrice: 92, coinAmount: 76, image: { uri: "https://i1.adis.ws/i/ArsenalDirect/jis8118_f?$pdpMainImage$" } },
    { id: "7", name: "Goalkeeper Jersey", category: "goalkeeper", description: "Orange goalkeeper shirt.", price: 77, coinPrice: 69, coinAmount: 57, image: { uri: "https://i1.adis.ws/i/ArsenalDirect/mis8115_f?$pdpMainImage$" } },
    { id: "8", name: "Goalkeeper Match Shorts", category: "goalkeeper", description: "Pro fit GK kit with pads.", price: 95, coinPrice: 85, coinAmount: 71, image: { uri: "https://i1.adis.ws/i/ArsenalDirect/mis8119_f?$mobileGallery$" } },
  ],

  
  "AC Milan": [
    { id: "1", name: "Home Jersey", category: "home", description: "Iconic red and black stripes with Puma logo.", price: 89, coinPrice: 80, coinAmount: 68, image: { uri: "https://store.acmilan.com/cdn/shop/files/774949-A81_01_0749f967-e0a8-4884-a11c-7eff3a6dbb09.jpg?v=1744277778&width=900" } },
    { id: "2", name: "Home Match Shorts", category: "home", description: "Authentic fit with dryCELL technology.", price: 104, coinPrice: 94, coinAmount: 78, image: { uri: "https://store.acmilan.com/cdn/shop/files/775128-B50_01_6f7a33d8-cd7b-4820-9e2c-c5c3d082e1da.jpg?v=1744318346&width=900" } },
    { id: "3", name: "Away Jersey", category: "away", description: "White away kit with red-black accents.", price: 86, coinPrice: 77, coinAmount: 65, image: { uri: "https://store.acmilan.com/cdn/shop/files/775013-B31_01.jpg?v=1744282069&width=900" } },
    { id: "4", name: "Away Match Shorts", category: "away", description: "Slim fit match shirt with classic design.", price: 101, coinPrice: 90, coinAmount: 74, image: { uri: "https://store.acmilan.com/cdn/shop/files/775130-B31_01_87e35ce3-3047-498c-b83d-1c2eaad4332c.jpg?v=1744287514&width=900" } },
    { id: "5", name: "Third Jersey", category: "third", description: "Dark third kit with gold AC Milan crest.", price: 90, coinPrice: 81, coinAmount: 68, image: { uri: "https://store.acmilan.com/cdn/shop/files/775028-B55_01.jpg?v=1744288374&width=900" } },
    { id: "6", name: "Third Match Shorts", category: "third", description: "Limited edition third shirt with pro cut.", price: 103, coinPrice: 92, coinAmount: 75, image: { uri: "https://store.acmilan.com/cdn/shop/files/775130-B60_01_a9e05bdc-5671-4e40-9236-41c6658906a9.jpg?v=1744281059&width=900" } },
    { id: "7", name: "Goalkeeper Jersey", category: "goalkeeper", description: "Green padded goalkeeper shirt.", price: 78, coinPrice: 70, coinAmount: 58, image: { uri: "https://store.acmilan.com/cdn/shop/files/783000-A81_01_2f98c19b-1819-443a-acf3-9e0bf0381729.jpg?v=1744295410&width=900" } },
    { id: "8", name: "GK Match Shorts", category: "goalkeeper", description: "Pro goalkeeper jersey with mesh panels.", price: 95, coinPrice: 85, coinAmount: 70, image: { uri: "https://store.acmilan.com/cdn/shop/files/783002-A81_01_9d029f10-daf7-46f5-8f84-58c0c3d20b01.jpg?v=1744301890&width=900" } },
  ],

  "Chelsea" : [
    { id: "1", name: "Home Jersey", category: "home", description: "Royal blue shirt with white trim.", price: 90, coinPrice: 81, coinAmount: 68, image: { uri: "https://images.footballfanatics.com/chelsea/chelsea-nike-home-stadium-shirt-2024-25_ss5_p-200851164+pv-2+u-canixtzkdetrqr6ldmyh+v-mvc5bda4wtxfphq5dscx.jpg?_hv=2&w=900" } },
    { id: "2", name: "Home Match Shorts", category: "home", description: "Dri-FIT ADV technology pro kit.", price: 106, coinPrice: 96, coinAmount: 80, image: { uri: "https://images.footballfanatics.com/chelsea/chelsea-nike-dri-fit-adv-home-match-short-2024-25_ss5_p-200851216+pv-2+u-knfhu3bwgoaw3kefzztd+v-qbjmkyodm4hk5svekm8p.jpg?_hv=2&w=900" } },
    { id: "3", name: "Away Jersey", category: "away", description: "White with blue abstract pattern.", price: 87, coinPrice: 78, coinAmount: 65, image: { uri: "https://images.footballfanatics.com/chelsea/chelsea-nike-away-stadium-shirt-2024-25_ss5_p-201095783+pv-2+u-vfx0sc8fgctpjop9net3+v-jivdoxhzhgke4obbsryt.jpg?_hv=2&w=900" } },
    { id: "4", name: "Away Match Shorts", category: "away", description: "Advanced cooling mesh away shirt.", price: 101, coinPrice: 90, coinAmount: 74, image: { uri: "https://images.footballfanatics.com/chelsea/chelsea-nike-away-stadium-shirt-2024-25_ss5_p-201095783+pv-4+u-vfx0sc8fgctpjop9net3+v-bnoss4cvir28ykqtysv3.jpg?_hv=2&w=900" } },
    { id: "5", name: "Third Jersey", category: "third", description: "Black third kit with bronze sponsor.", price: 89, coinPrice: 79, coinAmount: 67, image: { uri: "https://images.footballfanatics.com/chelsea/chelsea-nike-third-stadium-shirt-2024-25-kids_ss5_p-201095793+pv-1+u-fhyxpe0dmsbbcbbadnjw+v-hvaltcsqe1y3cohfxocl.jpg?_hv=2&w=900" } },
    { id: "6", name: "Third Match Shorts", category: "third", description: "Elite third jersey with tight tailoring.", price: 103, coinPrice: 91, coinAmount: 75, image: { uri: "https://images.footballfanatics.com/chelsea/chelsea-nike-third-stadium-short-2024-25-kids_ss5_p-201095798+pv-1+u-u3ihpxykg0shaq3semyw+v-vaqw4e4xgjdyommijvpt.jpg?_hv=2&w=900" } },
    { id: "7", name: "Goalkeeper Jersey", category: "goalkeeper", description: "Orange GK shirt with soft cuffs.", price: 78, coinPrice: 69, coinAmount: 58, image: { uri: "https://images.footballfanatics.com/chelsea/chelsea-nike-goalkeeper-stadium-shirt-2024-25_ss5_p-200851173+pv-1+u-9dy2hkdmdxmih0clfeug+v-jwx3drrtaw5v2vzzdaq6.jpg?_hv=2&w=900" } },
    { id: "8", name: "GK Match Shorts", category: "goalkeeper", description: "Authentic goalkeeper jersey with grip.", price: 94, coinPrice: 84, coinAmount: 70, image: { uri: "https://images.footballfanatics.com/chelsea/chelsea-nike-goalkeeper-stadium-short-2024-25-kids_ss5_p-200851175+pv-1+u-zmjgbrwdnfcy4id7xoah+v-3d6zigysgztnfnzdmgy0.jpg?_hv=2&w=900" } },
  ],

  "Liverpool": [
    { id: "1", name: "Home Jersey", category: "home", description: "Red shirt with white collar details.", price: 88, coinPrice: 79, coinAmount: 67, image: { uri: "https://store.liverpoolfc.com/media/catalog/product/cache/6e0c7b53c0ed72fe014b8d12b60d479c/f/n/fn8798g_1.jpg" } },
    { id: "2", name: "Home Match Shorts", category: "home", description: "Pro-fit match version with sponsor.", price: 102, coinPrice: 91, coinAmount: 76, image: { uri: "https://store.liverpoolfc.com/media/catalog/product/cache/6e0c7b53c0ed72fe014b8d12b60d479c/f/n/fn8863g_2.jpg" } },
    { id: "3", name: "Away Jersey", category: "away", description: "Black base with teal graphics.", price: 85, coinPrice: 75, coinAmount: 63, image: { uri: "https://store.liverpoolfc.com/media/catalog/product/cache/a8585741965541bd35c89e2a8929f2a6/f/n/fn8780-322_357863231_d_a_1x1.jpg" } },
    { id: "4", name: "Away Match Shorts", category: "away", description: "Authentic away kit for top performance.", price: 98, coinPrice: 87, coinAmount: 72, image: { uri: "https://store.liverpoolfc.com/media/catalog/product/cache/6e0c7b53c0ed72fe014b8d12b60d479c/f/v/fv7041-321_366082777_d_b_1x1.jpg" } },
    { id: "5", name: "Third Jersey", category: "third", description: "White and red gradient third kit.", price: 89, coinPrice: 79, coinAmount: 66, image: { uri: "https://store.liverpoolfc.com/media/catalog/product/cache/6e0c7b53c0ed72fe014b8d12b60d479c/f/q/fq2030w_fq2030-101-phsfm001.jpg" } },
    { id: "6", name: "Third Match Shorts", category: "third", description: "Pro third shirt with Nike Vaporknit.", price: 104, coinPrice: 93, coinAmount: 78, image: { uri: "https://store.liverpoolfc.com/media/catalog/product/cache/a8585741965541bd35c89e2a8929f2a6/f/q/fq2263-010-phsbm001.jpg" } },
    { id: "7", name: "Goalkeeper Jersey", category: "goalkeeper", description: "Green GK kit with textured sleeves.", price: 77, coinPrice: 68, coinAmount: 56, image: { uri: "https://store.liverpoolfc.com/media/catalog/product/cache/a8585741965541bd35c89e2a8929f2a6/h/q/hq4460g_hq4460-330-phsfm001_1.jpg" } },
    { id: "8", name: "GK Match Shorts", category: "goalkeeper", description: "Goalkeeper match kit with tight fit.", price: 93, coinPrice: 83, coinAmount: 70, image: { uri: "https://store.liverpoolfc.com/media/catalog/product/cache/6e0c7b53c0ed72fe014b8d12b60d479c/h/q/hq4465-329-phsbm001_1.jpg" } },
  ],

  "Manchester City": [
    { id: "1", name: "Home Jersey", category: "home", description: "Sky blue with classic collar.", price: 90, coinPrice: 81, coinAmount: 68, image: { uri: "https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/dw887b23ea/images/large/701230876001_pp_01_mcfc.png?sw=1600&sh=1600&sm=fit" } },
    { id: "2", name: "Home Match Shorts", category: "home", description: "Athletic fit with dryCELL tech.", price: 106, coinPrice: 96, coinAmount: 80, image: { uri: "https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/dwb76cdaa6/images/large/701230987001_pp_01_mcfc.png?sw=1600&sh=1600&sm=fit" } },
    { id: "3", name: "Away Jersey", category: "away", description: "Dark navy with mint accents.", price: 85, coinPrice: 75, coinAmount: 63, image: { uri: "https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/dw193884ae/images/large/701230949001_pp_01_mcfc.png?sw=1600&sh=1600&sm=fit" } },
    { id: "4", name: "Away Match Shorts", category: "away", description: "Slim cut match kit.", price: 100, coinPrice: 90, coinAmount: 74, image: { uri: "https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/dwd1e5ace2/images/large/701230987002_pp_01_mcfc.png?sw=1600&sh=1600&sm=fit" } },
    { id: "5", name: "Third Jersey", category: "third", description: "Abstract graphic third kit.", price: 88, coinPrice: 78, coinAmount: 66, image: { uri: "https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/dw26cc1479/images/large/701230959001_pp_01_mcfc.png?sw=1600&sh=1600&sm=fit" } },
    { id: "6", name: "Third Match Shorts", category: "third", description: "Stretch-fit pro third shirt.", price: 102, coinPrice: 91, coinAmount: 76, image: { uri: "https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/dw3d924b37/images/large/701230987003_pp_01_mcfc.png?sw=1600&sh=1600&sm=fit" } },
    { id: "7", name: "Goalkeeper Jersey", category: "goalkeeper", description: "Brownish shirt with pinkdetailing.", price: 79, coinPrice: 70, coinAmount: 58, image: { uri: "https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/dwcf804a34/images/large/701230984001_pp_01_mcfc.png?sw=1600&sh=1600&sm=fit" } },
    { id: "8", name: "GK Match Shorts", category: "goalkeeper", description: "Slim fit with shoulder mesh.", price: 94, coinPrice: 83, coinAmount: 70, image: { uri: "https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/dw72b258e3/images/large/701230992001_pp_01_mcfc.png?sw=1600&sh=1600&sm=fit" } },
  ],

  "Manchester United": [
    { id: "1", name: "Home Jersey", category: "home", description: "Red kit with black shoulder stripes.", price: 91, coinPrice: 82, coinAmount: 70, image: { uri: "https://mufc-live.cdn.scayle.cloud/images/8ed8c14d2c334556c14da1116ba32a50.jpg?brightness=1&width=1536&height=2048&quality=75&bg=ffffff" } },
    { id: "2", name: "Home Match Shorts", category: "home", description: "Player-fit home kit with crest detail.", price: 105, coinPrice: 95, coinAmount: 80, image: { uri: "https://mufc-live.cdn.scayle.cloud/images/dbbca3c5e395aabf916e65d4b4bb96dc.jpg?brightness=1&width=1536&height=2048&quality=75&bg=ffffff" } },
    { id: "3", name: "Away Jersey", category: "away", description: "Navy blue base with white collar and accents.", price: 86, coinPrice: 77, coinAmount: 65, image: { uri: "https://mufc-live.cdn.scayle.cloud/images/e8a92d15e1b75bb7994cb4c7ec3fd30c.jpg?brightness=1&width=1536&height=2048&quality=75&bg=ffffff" } },
    { id: "4", name: "Away Match Shorts", category: "away", description: "Official away match shirt 2024.", price: 100, coinPrice: 89, coinAmount: 74, image: { uri: "https://mufc-live.cdn.scayle.cloud/images/adf00e2bfdc34db3046e3b54fd10e6c5.jpg?brightness=1&width=922&height=1230&quality=75&bg=ffffff" } },
    { id: "5", name: "Third Jersey", category: "third", description: "Red and white stripe third kit.", price: 88, coinPrice: 78, coinAmount: 66, image: { uri: "https://mufc-live.cdn.scayle.cloud/images/0dd8a9fe914d7bca2c29eb631fa44e96.jpg?brightness=1&width=1536&height=2048&quality=75&bg=ffffff" } },
    { id: "6", name: "Third Match Shorts", category: "third", description: "Match edition with moisture zones.", price: 102, coinPrice: 91, coinAmount: 76, image: { uri: "https://mufc-live.cdn.scayle.cloud/images/198854e18240b73125870a84b4b426ab.jpg?brightness=1&width=922&height=1230&quality=75&bg=ffffff" } },
    { id: "7", name: "Goalkeeper Jersey", category: "goalkeeper", description: "Purple GK shirt with red shoulders.", price: 80, coinPrice: 71, coinAmount: 60, image: { uri: "https://mufc-live.cdn.scayle.cloud/images/619b8cd2e8656a17aeb80e9e58da83d0.jpg?brightness=1&width=1536&height=2048&quality=75&bg=ffffff" } },
    { id: "8", name: "Goalkeeper Match Kit", category: "goalkeeper", description: "Pro goalkeeper jersey with padding.", price: 96, coinPrice: 86, coinAmount: 72, image: { uri: "https://mufc-live.cdn.scayle.cloud/images/45355c5e21517c29605ef1c9255e8e76.jpg?brightness=1&width=1536&height=2048&quality=75&bg=ffffff" } },
  ],
  
};

export default function TeamProductsScreen() {
  const { params } = useRoute();
  const teamName = params?.teamName;
  const allProducts = productsData[teamName] || [];

  const [selectedCategory, setSelectedCategory] = useState("home");

  const screenWidth = Dimensions.get("window").width;
  const isSmallScreen = screenWidth < 400;
  const padding = 16;
  const gap = 12;
  const numColumns = isSmallScreen ? 1 : screenWidth > 800 ? 3 : 2;
  const cardWidth = (screenWidth - padding * 2 - gap * (numColumns - 1)) / numColumns;
  const isTablet = screenWidth > 700;
  const imageHeight = isTablet ? 200 : 160;
  const cardMaxHeight = isTablet ? 360 : 310;
  



  const filteredProducts = allProducts.filter(
    (item) => item.category === selectedCategory
  );

  const remainder = filteredProducts.length % numColumns;
  const paddedProducts =
    remainder === 0
      ? filteredProducts
      : [...filteredProducts, ...Array(numColumns - remainder).fill({ id: `blank-${remainder}`, empty: true })];

  const renderProduct = ({ item }) => {
    if (item.empty) return <View style={[styles.card, { width: cardWidth, opacity: 0 }]} />;

    return (
      <TouchableOpacity style={[styles.card, { width: cardWidth, maxHeight: cardMaxHeight }]}>
       <Image source={item.image} style={[styles.image, { height: imageHeight }]} />
        <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
        <View style={styles.topRow}>
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>{item.price}€</Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.coinText}>{item.coinPrice}€ with</Text>
          <Image source={require("../assets/coin.png")} style={styles.coinIcon} />
          <Text style={styles.coinText}>{item.coinAmount}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategorySelector = () => (
    <View style={styles.categoryRow}>
      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.key}
          style={[
            styles.categoryButton,
            selectedCategory === cat.key && styles.categoryButtonActive,
          ]}
          onPress={() => setSelectedCategory(cat.key)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === cat.key && styles.categoryTextActive,
            ]}
          >
            {cat.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderCategorySelector()}
      <FlatList
        data={paddedProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: gap }}
        contentContainerStyle={{
          paddingHorizontal: padding,
          paddingTop: 16,
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
    backgroundColor: "#f7f7f7",
    flexGrow: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  categoryButtonActive: {
    backgroundColor: "#27ae60",
    borderColor: "#27ae60",
  },
  categoryText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    alignItems: "center",
  },
  
  image: {
    width: "100%",
    resizeMode: "contain",
    marginBottom: 6,
  },
  
  
  
  topRow: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
    textAlign: "center",
  },
  priceBadge: {
    backgroundColor: "#e0f7e9",
    borderColor: "#27ae60",
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priceText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#27ae60",
  },
  description: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
    textAlign: "center",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinText: {
    fontSize: 11,
    color: "#444",
  },
  coinIcon: {
    width: 12,
    height: 12,
    marginHorizontal: 3,
    resizeMode: "contain",
  },
});
