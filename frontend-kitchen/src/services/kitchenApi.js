// src/services/kitchenApi.js - COMPLETE WORKING VERSION
import { KITCHEN_API_BASE_URL } from '../config';

class KitchenApiService {
  // Get orders by status
  static async getOrdersByStatus(status) {
    try {
      console.log(`🔍 Fetching ${status} orders`);
      
      // Get all order IDs first
      const response = await fetch(`${KITCHEN_API_BASE_URL}/to-prepare`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch orders`);
      }
      
      const orderIds = await response.json();
      console.log(`📋 Found ${orderIds.length} total orders:`, orderIds);
      
      if (orderIds.length === 0) {
        return [];
      }
      
      // Fetch details for each order
      const orders = await Promise.all(
        orderIds.map(async (orderId) => {
          try {
            const orderResponse = await fetch(`${KITCHEN_API_BASE_URL}/to-prepare/${orderId}`);
            
            if (orderResponse.ok) {
              const orderData = await orderResponse.json();
              
              // Only return orders that match the requested status
              if (orderData.orderStatus === status) {
                return this.formatOrderForFrontend(orderData);
              }
            }
            return null;
          } catch (error) {
            console.error(`❌ Error fetching order ${orderId}:`, error);
            return null;
          }
        })
      );
      
      const validOrders = orders.filter(order => order !== null)
        .sort((a, b) => a.number - b.number);
      
      console.log(`✅ Returning ${validOrders.length} ${status} orders`);
      return validOrders;
      
    } catch (error) {
      console.error(`❌ getOrdersByStatus failed for ${status}:`, error);
      throw error;
    }
  }

  // Get done orders
  static async getDoneOrders() {
        try {
            console.log(`🔍 Fetching DONE orders from: ${KITCHEN_API_BASE_URL}/done`);
            
            const response = await fetch(`${KITCHEN_API_BASE_URL}/done`);
            
            if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch done orders`);
            }
            
            const orderIds = await response.json();
            console.log(`📋 Found ${orderIds.length} done order IDs:`, orderIds);
            
            if (orderIds.length === 0) {
            console.log('📭 No done orders found');
            return [];
            }
            
            // Fetch done order details
            const orders = await Promise.all(
            orderIds.map(async (orderId) => {
                try {
                console.log(`📦 Fetching done order ${orderId} from: ${KITCHEN_API_BASE_URL}/done/${orderId}/view`);
                const orderResponse = await fetch(`${KITCHEN_API_BASE_URL}/done/${orderId}/view`);
                
                if (orderResponse.ok) {
                    const orderData = await orderResponse.json();
                    console.log(`✅ Successfully loaded done order ${orderId}:`, orderData);
                    return this.formatOrderForFrontend(orderData);
                } else {
                    console.warn(`⚠️ Could not fetch done order ${orderId}, status: ${orderResponse.status}`);
                    return null;
                }
                } catch (error) {
                console.error(`❌ Error fetching done order ${orderId}:`, error);
                return null;
                }
            })
            );
            
            const validOrders = orders.filter(order => order !== null)
            .sort((a, b) => b.number - a.number);
            
            console.log(`✅ Returning ${validOrders.length} valid done orders`);
            return validOrders;
            
        } catch (error) {
            console.error(`❌ getDoneOrders failed:`, error);
            throw error;
        }
    }

  // Format order data for frontend
  static formatOrderForFrontend(orderData) {
    return {
      _id: orderData.orderId,
      number: orderData.orderId,
      state: orderData.orderStatus,
      orderType: orderData.orderType || 'DINE_IN',
      date: orderData.orderDateTime ? 
        new Date(orderData.orderDateTime).toLocaleDateString() : 
        new Date().toLocaleDateString(),
      orderItems: orderData.orderItems?.map(item => ({
        name: item.itemName || 'Unknown Item',
        quantity: item.quantity || 1,
        price: item.itemPrice || 0,
        size: item.itemSize || 'M'
      })) || []
    };
  }

  // Update order status
  static async updateOrderStatus(orderId, newStatus) {
    try {
      let endpoint = '';
      switch (newStatus) {
        case 'PREPARING':
          endpoint = `/to-prepare/${orderId}/start`;
          break;
        case 'NOW_SERVING':
          endpoint = `/to-prepare/${orderId}/ready`;
          break;
        case 'DONE':
          endpoint = `/to-prepare/${orderId}/done`;
          break;
        default:
          throw new Error('Invalid status');
      }

      console.log(`🔄 Updating order ${orderId} to ${newStatus}: ${KITCHEN_API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${KITCHEN_API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log(`✅ Successfully updated order ${orderId} to ${newStatus}`);
      return result;
      
    } catch (error) {
      console.error(`❌ updateOrderStatus failed for order ${orderId}:`, error);
      throw error;
    }
  }

  // Real-time updates - FIXED: Make it static
  static setupOrderStream(onNewOrder, onStatusChange) {
    try {
      console.log(`📡 Setting up SSE connection to: ${KITCHEN_API_BASE_URL}/stream`);
      const eventSource = new EventSource(`${KITCHEN_API_BASE_URL}/stream`);
      
      eventSource.addEventListener('new-order', (event) => {
        console.log('🆕 New order event received:', event.data);
        try {
          const orderData = JSON.parse(event.data);
          onNewOrder(orderData);
        } catch (error) {
          console.error('❌ Error parsing new-order event:', error);
        }
      });

      eventSource.addEventListener('open', () => {
        console.log('✅ SSE connection established');
      });

      eventSource.onerror = (error) => {
        console.error('❌ SSE connection error:', error);
        setTimeout(() => {
          console.log('🔄 Attempting to reconnect SSE...');
          KitchenApiService.setupOrderStream(onNewOrder, onStatusChange);
        }, 5000);
      };

      return eventSource;
    } catch (error) {
      console.error('❌ Failed to setup SSE stream:', error);
      return null;
    }
  }
}

export default KitchenApiService;