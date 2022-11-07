import { ICustomers } from './customers.interface';
import {Document} from 'mongoose';

export interface ICustomersModel extends Document, ICustomers {}
