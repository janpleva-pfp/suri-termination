export const VEHICLE_UNKNOWN = 'unknown';
export const MAX_ENGINE_CAPACITY = 100000;
export const MAX_ENGINE_POWER = 1000;
export const VEHICLE_MAX_PRICE = 11000000;
export const VEHICLE_MIN_PRICE = 20000;
export const VEHICLE_MIN_WEIGHT = 0;
export const VEHICLE_MAX_WEIGHT = 100000;
export const MAX_NAME_LENGTH = 100;
export const MAX_PEREX_LENGTH = 1000;
export const USER_MAX_AGE = 99;
export const USER_MIN_AGE = 15;
export const POLICY_HOLDER_MIN_AGE = 18;
export const POLICY_HOLDER_MIN_AGE_MOTORCYCLE = 15;
export const POLICY_HOLDER_DEFAULT_AGE = 40;
export const VEHICLE_MIN_SEATS = 1;
export const VEHICLE_MAX_SEATS = 9;
export const VEHICLE_MAX_SEATS_MOTORCYCLE = 2;
export const VEHICLE_MIN_FIRST_REGISTERED_DATE = '1886-01-01';

export const FORM_ERR_FIELD_NAME = 'Toto pole může obsahovat pouze písemné znaky.';

export const FORM_FIELD_NAME_REGEX = /^([A-Za-zÀ-ÖØ-öø-ÿÁ-ĚÍ-Žž]+[\-\s’'])*([A-Za-zÀ-ÖØ-öø-ÿÁ-ĚÍ-Žž])+$/;
export const FORM_ERR_FIELD_REQUIRED = 'Toto pole je povinné.';
export const FORM_ERR_FIELD_EMAIL = 'E-mail musí být ve formátu "priklad@e-mail.cz".';
export const FORM_FIELD_EMAIL_REGEX = new RegExp(
  "^[a-z0-9!#$%&'+/=?^_{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*@(?:[a-z0-9]" +
    '(?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$',
  'i',
);
export const FORM_ERR_FIELD_TOWN = 'Vyberte obec.';
export const FORM_ERR_FIELD_ZIP = 'Zadejte správné PSČ.';
export const FORM_ERR_FIELD_USER = 'Věk provozovatele musí být minimálně 15 let.';
export const FORM_ERR_FIELD_POLICY_HOLDER = 'Věk pojistníka musí být minimálně 18 let.';
export const FORM_ERR_FIELD_POLICY_HOLDER_MOTORCYCLE = 'Věk pojistníka musí být minimálně 15 let.';
export const FORM_FIELD_REG_PLATE_REGEX = /^([A-PR-VX-Z0-9]{5,8})$/;
export const FORM_FIELD_VIN_REGEX = /^(([0-9A-HJ-NPR-Z]{17})|([0-9A-Z]{4,16})|(NEN[I\xcd]))$/;
export const FORM_ERR_FIELD_VIN =
  'VIN musí být ve formátu 17 znaků z TK (případně doplněno o nuly na začátku) nebo "není"';
export const FORM_FIELD_TECH_CARD_ID_REGEX = /^([A-Z]{2}\d{6}|(NEN[I\xcd]))$/;
export const FORM_FIELD_VEHICLE_REG_ID_REGEX = /^[A-Za-z]{3}\d{6}$/;
export const FORM_ERR_FIELD_TECH_CARD_ID =
  'Série a číslo technického průkazu musí být ve formátu "AX123456" nebo "není"';
export const FORM_ERR_FIELD_VEHICLE_REG_ID = 'Číslo osvědčení o registraci vozidla musí být ve formátu “XYZ123456”';
export const FORM_FIELD_PHONE_REGEX = /^\d{9}$/;
export const FORM_FIELD_BIRTH_NUMBER_NEW_FORMAT_REGEX =
  /^(\d{2}(0[1-9]|1[0-2]|5[1-9]|6[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/?\d{4})$/;
export const FORM_FIELD_BIRTH_NUMBER_OLD_FORMAT_REGEX =
  /^((0[0-9]|[1-4][0-9]|5[0-3])(0[1-9]|1[0-2]|5[1-9]|6[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/?\d{3})$/;
export const FORM_FIELD_VAT_ID_REGEX = /^\d{8}$/;
export const FORM_FIELD_VRP_REGEX = /^[a-zA-Z0-9]{3,10}$/;
export const FORM_ERR_FIELD_VRP = 'Zadaná SPZ není validní.';
export const FORM_ERR_FIELD_VAT_ID = 'IČO musí mít být ve formátu "06938662".';
export const FORM_ERR_FIELD_BIRTH_NUMBER_LABEL = 'Zadané rodné číslo není validní.';
export const FORM_ERR_FIELD_BIRTH_NUMBER_NEW_FORMAT_LABEL =
  'Rodné číslo musí být ve formátu "951211/1356" nebo "9512111356".';
export const FORM_ERR_FIELD_PHONE = 'Telefonní číslo musí být ve formátu "772 555 235".';
export const FORM_ERR_FIELD_MAX_VALUE = 'Maximální hodnota pole je:';
export const FORM_ERR_FIELD_MIN_VALUE = 'Minimální hodnota pole je:';
export const FORM_ERR_FIELD_MAX_LENGTH = 'Maximální počet znaků je:';
export const FORM_ERR_FIELD_MIN_LENGTH = 'Minimální počet znaků je:';
export const FORM_ERR_TRAILER_MAX_WEIGHT = 'Přípojné vozidlo do 750 kg. Maximální hmotnost 750 kg.';
export const FORM_ERR_TRAILER_MIN_WEIGHT = 'Přípojné vozidlo nad 750 kg. Minimální hmotnost 751 kg.';
export const FORM_ERR_MIN_FIRST_REGISTERED = 'Vozidlo musí být registrováno po datu 1. 1. 1886.';
export const FORM_ERR_MAX_FIRST_REGISTERED = 'Vozidlo nesmí být registrováno s pozdějším než dnešním datem.';
export const FORM_ERR_TRAILER_CATEGORY_REQUIRED = 'Chybí kategorie přípojného vozidla.';
export const FORM_ADDRESS_NOT_FOUND = 'Adresa nenalezena, chcete být kontaktován?';
export const FORM_SELECT_NO_OPTIONS = 'Žádný výsledek, pokračujte v hledání.';
export const FORM_SELECT_LOADING = 'Hledáme..';
export const FORM_FIELD_BANK_ACCOUNT_REGEX = /^\d+\/\d+$/;
export const FORM_ERR_FIELD_BANK_ACCOUNT = 'Číslo účtu musí být ve formátu "číslo/číslo".';
