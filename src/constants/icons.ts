// src/constants/icons.ts
import BiaMrt120 from "../assets/BiaMrt120.png";
import BiaO105 from "../assets/BiaO105.png";
import CiaIMtz from "../assets/CiaIMtz.png";
import IniBtlMtz from "../assets/IniBtlMtz.png";
import IniCiaCC from "../assets/IniCiaCC.png";
import IniCiaInfMec from "../assets/IniCiaInfMec.png";
import IniCiaMec from "../assets/IniCiaMec.png";
import IniCiaMtz from "../assets/IniCiaMtz.png";
import IniPelMtzIni from "../assets/IniPelMtzIni.png";
import PelIMtz from "../assets/PelIMtz.png";
import PelInf from "../assets/PelInf.png";
import Target from "../assets/target.png";

export const ICONS = {
  PelIMtz,
  CiaIMtz,
  PelInf,
  IniBtlMtz,
  IniCiaCC,
  IniCiaInfMec,
  IniCiaMec,
  IniCiaMtz,
  IniPelMtzIni,
  BiaO105,
  BiaMrt120,
  PV: Target,
  Target,
} as const;

export type IconKey = keyof typeof ICONS;
