DO $$
DECLARE snmp_id INT; remote_id INT;
BEGIN
INSERT INTO access_list (name) VALUES ('SNMP-ACCESS-ONLY') RETURNING id INTO snmp_id;
INSERT INTO access_list (name) VALUES ('REMOTE-MANAGEMENT-STATIONS') RETURNING id INTO remote_id;
INSERT INTO access_item (list_id, subnet, description) VALUES
  (snmp_id, '10.17.72.14/32', ''),
  (snmp_id, '10.17.72.16/32', ''),
  (snmp_id, '10.17.72.17/32', ''),
  (snmp_id, '10.17.72.18/32', ''),
  (snmp_id, '10.17.72.19/32', ''),
  (snmp_id, '10.17.72.20/32', ''),
  (snmp_id, '10.17.72.21/32', ''),
  (snmp_id, '10.17.72.22/32', ''),
  (snmp_id, '10.17.72.23/32', ''),
  (snmp_id, '10.17.72.24/32', ''),
  (snmp_id, '10.17.72.25/32', ''),
  (snmp_id, '10.228.33.162/32', ''),
  (snmp_id, '10.228.33.230/32', ''),
  (snmp_id, '10.228.33.231/32', ''),
  (snmp_id, '10.17.72.15/32', ''),
  (remote_id, '10.16.17.183/32', ''),
  (remote_id, '10.16.23.48/32', ''),
  (remote_id, '10.16.23.76/32', ''),
  (remote_id, '10.16.23.85/32', ''),
  (remote_id, '10.16.23.225/32', ''),
  (remote_id, '10.16.23.227/32', ''),
  (remote_id, '10.16.23.229/32', ''),
  (remote_id, '10.16.23.230/32', ''),
  (remote_id, '10.16.23.231/32', ''),
  (remote_id, '10.16.23.232/32', ''),
  (remote_id, '10.16.150.129/32', ''),
  (remote_id, '10.17.100.2/32', ''),
  (remote_id, '10.17.100.3/32', ''),
  (remote_id, '10.21.66.104/32', ''),
  (remote_id, '10.21.66.105/32', ''),
  (remote_id, '10.21.66.114/32', ''),
  (remote_id, '10.225.50.32/32', ''),
  (remote_id, '10.225.50.33/32', ''),
  (remote_id, '10.228.33.224/32', ''),
  (remote_id, '10.228.33.251/32', ''),
  (remote_id, '172.23.40.0/22', ''),
  (remote_id, '172.23.44.0/22', '');
END $$;
