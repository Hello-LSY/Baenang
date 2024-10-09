// components/FlagIcon.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import AeFlag from '../assets/flags/ae.svg';
import AuFlag from '../assets/flags/au.svg';
import BnFlag from '../assets/flags/bn.svg';
import BhFlag from '../assets/flags/bh.svg';
import CaFlag from '../assets/flags/ca.svg';
import CnFlag from '../assets/flags/cn.svg';
import ChFlag from '../assets/flags/ch.svg';
import DkFlag from '../assets/flags/dk.svg';
import GBFlag from '../assets/flags/gb.svg';
import HkFlag from '../assets/flags/hk.svg';
import IdFlag from '../assets/flags/id.svg';
import JpFlag from '../assets/flags/jp.svg';
import KrFlag from '../assets/flags/kr.svg';
import KwFlag from '../assets/flags/kw.svg';
import MyFlag from '../assets/flags/my.svg';
import NoFlag from '../assets/flags/no.svg';
import NzFlag from '../assets/flags/nz.svg';
import SaFlag from '../assets/flags/sa.svg';
import SeFlag from '../assets/flags/se.svg';
import SgFlag from '../assets/flags/sg.svg';
import ThFlag from '../assets/flags/th.svg';
import UsFlag from '../assets/flags/us.svg';
import EuFlag from '../assets/flags/eu.svg';

const flagComponents = {
  aed: AeFlag,
  aud: AuFlag,
  bnd: BnFlag,
  bhd: BhFlag,
  cad: CaFlag,
  cny: CnFlag,
  cnh: CnFlag,
  chf: ChFlag,
  dkk: DkFlag,
  gbp: GBFlag,
  hkd: HkFlag,
  idr: IdFlag,
  jpy: JpFlag,
  krw: KrFlag,
  kwd: KwFlag,
  myr: MyFlag,
  nok: NoFlag,
  nzd: NzFlag,
  sar: SaFlag,
  sek: SeFlag,
  sgd: SgFlag,
  thb: ThFlag,
  usd: UsFlag,
  eur: EuFlag,
};

const FlagIcon = ({ currencyCode, size = 36, style }) => {
  const FlagComponent = flagComponents[currencyCode.toLowerCase()];

  if (!FlagComponent) {
    console.warn(`Flag not found for currency code: ${currencyCode}`);
    return null; // 또는 기본 플래그를 표시할 수 있습니다.
  }

  return (
    <View style={[styles.flagContainer, { width: size, height: size }, style]}>
      <View style={[styles.flagWrapper, { width: size - 6, height: size - 6 }]}>
        <View
          style={[styles.flagShadow, { width: size - 6, height: size - 6 }]}
        >
          <FlagComponent
            width={size - 6}
            height={size - 6}
            viewBox="0 0 512 512"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flagContainer: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  flagWrapper: {
    borderRadius: 15,
    overflow: 'hidden',
    margin: 3,
    backgroundColor: 'white',
  },
  flagShadow: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
});

export default FlagIcon;
